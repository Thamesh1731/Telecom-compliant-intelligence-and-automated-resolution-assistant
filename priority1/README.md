# Telecom Complaint Priority Model

Assigns a single priority level — **P1**, **P2**, **P3**, or **P4** — to a
telecom customer complaint by combining two existing ML models:

| Model | Architecture | File / Hub ID |
|-------|-------------|---------------|
| **Urgency** | DistilBERT (hybrid: ML + rule engine) | `naman9705/signal-cx-urgency-distilbert` loaded via `urgency/urgency_engine_v2.py` |
| **Severity** | DeBERTa-v2 (fine-tuned) | `severity_outputs/severity_transformer/` |

---

## Priority Levels

| Level | Label | Meaning |
|-------|-------|---------|
| **P1** | Critical | Immediate action required |
| **P2** | High | Urgent — resolve within hours |
| **P3** | Medium | Moderate — resolve within a day |
| **P4** | Low | Routine — standard queue |

---

## Urgency Model

**File:** `urgency/urgency_engine_v2.py`  
**Public function:** `predict_urgency(complaint, status) -> dict`

The urgency engine is a **hybrid model**:

- **ML component** — DistilBERT fine-tuned on 9 724 telecom complaints
  (`SignalCX_urgency_dataset_9724.xlsx`), serving four classes:
  `LOW | MEDIUM | HIGH | CRITICAL`
- **Rule engine** — `urgency_rules_v2.py` with regex-based signal detection
  (emergency, service failure, billing, duration, etc.)

The engine returns `hybrid_urgency` in the range **[−1.0, +1.0]** and a
human-readable `description` (CRITICAL / HIGH / MEDIUM / LOW).

The priority model normalises `hybrid_urgency` to **[0.0, 1.0]**:

```
urgency_score = (hybrid_urgency + 1.0) / 2.0
```

---

## Severity Model

**Directory:** `severity_outputs/severity_transformer/`  
**Architecture:** `DebertaV2ForSequenceClassification`

Native output labels (from `config.json`):

| ID | Native Label | Canonical Label |
|----|--------------|-----------------|
| 0 | Mild | LOW |
| 1 | Moderate | MEDIUM |
| 2 | Severe | HIGH |
| 3 | Critical | CRITICAL |

The priority model runs a softmax pass and derives a single **severity_score**
in [0.0, 1.0] via a weighted sum:

```
severity_score =
    p(Mild)     × 0.00
  + p(Moderate) × 0.33
  + p(Severe)   × 0.67
  + p(Critical) × 1.00
```

---

## Decision Logic

### Step 1 — Critical Fast Path
If **urgency == CRITICAL** or **severity == CRITICAL**, return **P1** immediately.

### Step 2 — Combined Score
```
combined_score = (0.60 × severity_score) + (0.40 × urgency_score)
```
Both scores are normalised to [0.0, 1.0] before this calculation.

### Step 3 — Threshold Mapping

| combined_score | Priority |
|----------------|----------|
| ≥ 0.85 | **P1** |
| ≥ 0.65 | **P2** |
| ≥ 0.40 | **P3** |
| < 0.40 | **P4** |

### Step 4 — Label Override
Take the *highest* priority (lowest P number) from:
- Score-derived priority (Step 3)
- Urgency label-based priority
- Severity label-based priority

Label → Priority mapping:
```
CRITICAL → P1
HIGH     → P2
MEDIUM   → P3
LOW      → P4
NEUTRAL  → P4  (urgency only)
```

The final result is **always** one of `P1`, `P2`, `P3`, `P4`.

---

## File Structure

```
pr/
├── priority_model.py       ← main inference logic / public API
├── priority_config.py      ← labels, weights, thresholds, mappings
├── test_priority_model.py  ← unit tests
├── README.md               ← this file
│
├── urgency/
│   ├── urgency_engine_v2.py     ← hybrid urgency engine (used by priority_model)
│   ├── urgency_rules_v2.py      ← rule-based urgency signals
│   ├── train_urgency_distilbert.py
│   ├── train_urgency_v3.py
│   ├── urgency_ml_model_final.pkl
│   ├── urgency_ml_model_final_v3.pkl
│   └── SignalCX_urgency_dataset_9724.xlsx
│
└── severity_outputs/
    ├── severity_transformer/    ← DeBERTa-v2 model (used by priority_model)
    │   ├── config.json
    │   ├── model.safetensors
    │   ├── tokenizer.json
    │   └── ...
    └── checkpoints/
```

---

## Public API

```python
from priority_model import process_complaint

result = process_complaint(
    complaint="My internet has been down for 10 days, contacted support 5 times.",
    status="Open",   # optional; default "Open"
)
```

### Return value

```python
{
    "complaint":       "My internet has been down for 10 days...",
    "urgency":         "CRITICAL",
    "urgency_score":   0.92,
    "severity":        "HIGH",
    "severity_score":  0.78,
    "priority":        "P1",
    "priority_score":  0.864,
    "priority_reason": "Critical override: critical urgency"
}
```

Both models are loaded **once** on the first call and cached for all subsequent
calls (singleton pattern). The function never raises; invalid model output
triggers safe fallback to LOW / 0.0.

---

## Running Unit Tests

```bash
# From the pr/ directory:
python test_priority_model.py

# Or with pytest for richer output:
pip install pytest
pytest test_priority_model.py -v
```

Tests use `unittest.mock` to patch the underlying models so no GPU or network
access is required to run them.

### Test coverage

| Test class | What it checks |
|------------|----------------|
| `TestOutputStructure` | Schema, score ranges, priority always in {P1-P4} |
| `TestCriticalUrgency` | Critical urgency → P1 (all severity combinations) |
| `TestCriticalSeverity` | Critical severity → P1 (all urgency combinations) |
| `TestHighPriority` | HIGH+HIGH → P2 |
| `TestMediumPriority` | MEDIUM+MEDIUM → P3/P4 |
| `TestLowPriority` | LOW+LOW → P4, NEUTRAL+LOW → P4 |
| `TestFallbackBehavior` | Missing score, invalid label, model unavailable |
| `TestBoundaryThresholds` | Exact boundary values at 0.85 / 0.65 / 0.40 |
| `TestNormalisationHelpers` | Score normalisation, label mapping, derive_severity_score |
| `TestLabelOverride` | Label-based escalation overrides score-derived priority |

---

## Example Outputs

### Example 1 — Emergency (P1)
```
Complaint  : My router is on fire and I cannot call 911 - life-threatening!
Urgency    : CRITICAL  (score=1.0000)
Severity   : CRITICAL  (score=1.0000)
Priority   : P1 — Critical
P-Score    : 1.0000
Reason     : Critical override: critical urgency and critical severity
```

### Example 2 — Extended Outage (P1/P2)
```
Complaint  : Internet completely down for 10 days, contacted support 5 times, nobody fixed it.
Urgency    : CRITICAL  (score=1.0000)
Severity   : HIGH      (score=0.6700)
Priority   : P1 — Critical
P-Score    : 0.8020
Reason     : Critical override: critical urgency
```

### Example 3 — Billing Fraud (P2)
```
Complaint  : Double-billed and Comcast refuses to process my refund. Fraudulent.
Urgency    : HIGH      (score=0.7500)
Severity   : HIGH      (score=0.6700)
Priority   : P2 — High
P-Score    : 0.7020
Reason     : Combined score 0.702 (severity high, urgency high)
```

### Example 4 — Slow Internet (P3)
```
Complaint  : My internet speed has been slow since last week.
Urgency    : MEDIUM    (score=0.5000)
Severity   : MEDIUM    (score=0.3300)
Priority   : P3 — Medium
P-Score    : 0.3980
Reason     : Combined score 0.398 (severity medium, urgency medium)
```

### Example 5 — Password Query (P4)
```
Complaint  : How do I change my Wi-Fi password?
Urgency    : LOW       (score=0.0000)
Severity   : LOW       (score=0.0000)
Priority   : P4 — Low
P-Score    : 0.0000
Reason     : Combined score 0.000 (severity low, urgency low)
```

---

## Dependencies

```
torch >= 2.0
transformers >= 4.30
sentencepiece          # required by DeBERTa-v2 tokenizer
joblib                 # already installed with sklearn
scikit-learn >= 1.0
```

The models are loaded automatically — no manual download step is required.
The urgency model is downloaded from HuggingFace Hub (`naman9705/signal-cx-urgency-distilbert`)
on first use; the severity model is read from the local `severity_outputs/severity_transformer/` directory.
