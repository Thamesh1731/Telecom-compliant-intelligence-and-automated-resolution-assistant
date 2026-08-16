"""
priority_model.py
=================
Telecom complaint priority model.

Combines the existing urgency model (urgency_engine_v2.py) and severity model
(DeBERTa-v2 fine-tuned transformer at severity_outputs/severity_transformer/)
to output a single priority level: P1, P2, P3, or P4.

Public API
----------
    process_complaint(complaint, status="Open") -> dict

Priority levels
---------------
    P1 = Critical
    P2 = High
    P3 = Medium
    P4 = Low

Decision logic
--------------
1.  If urgency is CRITICAL or severity is CRITICAL, return P1 immediately.
2.  Compute combined_score = (0.60 x severity_score) + (0.40 x urgency_score)
    where both scores are normalised to [0.0, 1.0].
3.  Map combined_score to a priority via fixed thresholds.
4.  Take the *highest* priority (lowest P number) from:
        (a) score-derived priority
        (b) urgency label-based priority
        (c) severity label-based priority
5.  Return the final priority, which is always in {P1, P2, P3, P4}.

Models used
-----------
Urgency  : naman9705/signal-cx-urgency-distilbert  (via urgency_engine_v2.py)
Severity : severity_outputs/severity_transformer/  (DeBERTa-v2 local checkpoint)
"""

from __future__ import annotations

import os
import sys
import logging
from typing import Optional

# ---------------------------------------------------------------------------
# Insert the urgency package directory onto the path so that
# urgency_engine_v2.py and urgency_rules_v2.py can be imported cleanly.
# ---------------------------------------------------------------------------
_HERE = os.path.dirname(os.path.abspath(__file__))
_URGENCY_DIR = os.path.join(_HERE, "urgency")
if _URGENCY_DIR not in sys.path:
    sys.path.insert(0, _URGENCY_DIR)

from priority_config import (
    SEVERITY_WEIGHT,
    URGENCY_WEIGHT,
    THRESHOLD_P1,
    THRESHOLD_P2,
    THRESHOLD_P3,
    LABEL_TO_PRIORITY,
    PRIORITY_RANK,
    PRIORITY_DESCRIPTIONS,
    URGENCY_LABEL_MAP,
    SEVERITY_LABEL_MAP,
    URGENCY_LABEL_TO_SCORE,
    SEVERITY_LABEL_TO_SCORE,
    URGENCY_RAW_MIN,
    URGENCY_RAW_MAX,
    SEVERITY_CLASS_WEIGHTS,
    FALLBACK_URGENCY_LABEL,
    FALLBACK_URGENCY_SCORE,
    FALLBACK_SEVERITY_LABEL,
    FALLBACK_SEVERITY_SCORE,
)

logger = logging.getLogger(__name__)


# ============================================================
# LAZY-LOADED MODEL SINGLETONS
# (each model is loaded at most once per process)
# ============================================================

_urgency_predict_fn = None        # callable: predict_urgency(complaint, status)
_severity_tokenizer = None        # HuggingFace tokenizer
_severity_model = None            # HuggingFace model
_severity_device = None           # torch.device


def _load_urgency_model() -> None:
    """
    Import urgency_engine_v2 and cache its predict_urgency function.

    The module-level code in urgency_engine_v2.py loads the DistilBERT model
    on import; we capture the public function predict_urgency so the rest of
    this module never has to import the urgency package again.
    """
    global _urgency_predict_fn
    if _urgency_predict_fn is not None:
        return

    try:
        import urgency_engine_v2 as ue
        _urgency_predict_fn = ue.predict_urgency
        logger.info("Urgency model loaded via urgency_engine_v2.predict_urgency")
    except Exception as exc:
        logger.error("Failed to load urgency model: %s", exc)
        _urgency_predict_fn = None


def _load_severity_model() -> None:
    """
    Load the DeBERTa-v2 severity transformer from the local directory
    severity_outputs/severity_transformer/.

    The model is loaded once and cached in module-level variables.
    """
    global _severity_tokenizer, _severity_model, _severity_device

    if _severity_model is not None:
        return

    severity_dir = os.path.join(
        _HERE,
        "severity_outputs",
        "severity_transformer",
    )

    try:
        import torch
        from transformers import AutoTokenizer, AutoModelForSequenceClassification

        logger.info("Loading DeBERTa-v2 severity model from %s ...", severity_dir)

        _severity_tokenizer = AutoTokenizer.from_pretrained(severity_dir)
        _severity_model = AutoModelForSequenceClassification.from_pretrained(severity_dir)
        _severity_model.eval()

        _severity_device = torch.device(
            "cuda" if torch.cuda.is_available() else "cpu"
        )
        _severity_model.to(_severity_device)

        logger.info("Severity model loaded on device: %s", _severity_device)

    except Exception as exc:
        logger.error("Failed to load severity model: %s", exc)
        _severity_tokenizer = None
        _severity_model = None
        _severity_device = None


# ============================================================
# NORMALISATION HELPERS
# ============================================================

def _normalise_urgency_label(raw_label: str) -> str:
    """
    Convert the raw description from urgency_engine_v2 to a canonical label.

    Urgency engine can produce: CRITICAL, HIGH, MEDIUM, NEUTRAL, LOW.
    Unknown values fall back to LOW.
    """
    key = str(raw_label).strip().upper()
    return URGENCY_LABEL_MAP.get(key, FALLBACK_URGENCY_LABEL)


def _normalise_severity_label(raw_label: str) -> str:
    """
    Convert the raw label from the DeBERTa severity model to a canonical label.

    Model produces: Mild, Moderate, Severe, Critical (title-case).
    Normalises to:  LOW,  MEDIUM,   HIGH,   CRITICAL.
    Unknown values fall back to LOW.
    """
    stripped = str(raw_label).strip()
    # Try exact match first, then upper-case fallback
    if stripped in SEVERITY_LABEL_MAP:
        return SEVERITY_LABEL_MAP[stripped]
    return SEVERITY_LABEL_MAP.get(stripped.upper(), FALLBACK_SEVERITY_LABEL)


def _normalise_urgency_score(raw_score: float) -> float:
    """
    Map the urgency engine's hybrid_urgency score from [-1.0, +1.0] to [0.0, 1.0].

    Formula: normalised = (raw - min) / (max - min)
                       = (raw + 1.0) / 2.0
    """
    span = URGENCY_RAW_MAX - URGENCY_RAW_MIN
    if span == 0:
        return 0.5
    normalised = (raw_score - URGENCY_RAW_MIN) / span
    return max(0.0, min(1.0, normalised))


def _derive_severity_score(probability_map: dict) -> float:
    """
    Convert per-class softmax probabilities from the severity model into a
    single numeric score in [0.0, 1.0] using a weighted sum.

    The severity model's id2label (from config.json):
        0 = Mild   -> canonical LOW      weight 0.00
        1 = Moderate -> canonical MEDIUM  weight 0.33
        2 = Severe -> canonical HIGH     weight 0.67
        3 = Critical -> canonical CRITICAL weight 1.00

    Parameters
    ----------
    probability_map : dict[str, float]
        Keys are the model's native label strings (Mild, Moderate, Severe, Critical).
        Values are softmax probabilities.
    """
    score = 0.0
    for native_label, prob in probability_map.items():
        canonical = _normalise_severity_label(native_label)
        weight = SEVERITY_CLASS_WEIGHTS.get(canonical, 0.0)
        score += prob * weight
    return max(0.0, min(1.0, score))


# ============================================================
# URGENCY INFERENCE
# ============================================================

def _get_urgency(complaint: str, status: str) -> tuple[str, float]:
    """
    Run the urgency model and return (normalised_label, normalised_score).

    Returns (FALLBACK_URGENCY_LABEL, FALLBACK_URGENCY_SCORE) on any error.
    """
    _load_urgency_model()

    if _urgency_predict_fn is None:
        logger.warning("Urgency model unavailable; using fallback.")
        return FALLBACK_URGENCY_LABEL, FALLBACK_URGENCY_SCORE

    try:
        result = _urgency_predict_fn(complaint, status)

        raw_label = result.get("description", "")
        raw_score = result.get("hybrid_urgency", None)

        label = _normalise_urgency_label(raw_label)

        if raw_score is None:
            # Fall back to a score derived from the label
            score = URGENCY_LABEL_TO_SCORE.get(label, FALLBACK_URGENCY_SCORE)
        else:
            score = _normalise_urgency_score(float(raw_score))

        return label, round(score, 4)

    except Exception as exc:
        logger.error("Urgency inference error: %s", exc)
        return FALLBACK_URGENCY_LABEL, FALLBACK_URGENCY_SCORE


# ============================================================
# SEVERITY INFERENCE
# ============================================================

def _get_severity(complaint: str) -> tuple[str, float]:
    """
    Run the DeBERTa-v2 severity model and return (normalised_label, score).

    Returns (FALLBACK_SEVERITY_LABEL, FALLBACK_SEVERITY_SCORE) on any error.
    """
    _load_severity_model()

    if _severity_model is None:
        logger.warning("Severity model unavailable; using fallback.")
        return FALLBACK_SEVERITY_LABEL, FALLBACK_SEVERITY_SCORE

    try:
        import torch

        inputs = _severity_tokenizer(
            str(complaint),
            return_tensors="pt",
            truncation=True,
            max_length=512,
        )
        inputs = {k: v.to(_severity_device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = _severity_model(**inputs)

        probs = torch.softmax(outputs.logits, dim=-1)[0].cpu().numpy()

        # Build probability map keyed by the model's native id2label strings
        id2label = _severity_model.config.id2label  # e.g. {0: "Mild", ...}
        probability_map = {
            id2label[i]: float(probs[i])
            for i in range(len(probs))
            if i in id2label
        }

        # Predicted label = argmax
        pred_idx = int(probs.argmax())
        raw_label = id2label.get(pred_idx, "")
        label = _normalise_severity_label(raw_label)

        if not label:
            label = FALLBACK_SEVERITY_LABEL

        score = _derive_severity_score(probability_map)

        return label, round(score, 4)

    except Exception as exc:
        logger.error("Severity inference error: %s", exc)
        return FALLBACK_SEVERITY_LABEL, FALLBACK_SEVERITY_SCORE


# ============================================================
# PRIORITY DECISION ENGINE
# ============================================================

def _compute_combined_score(
    severity_score: float,
    urgency_score: float,
) -> float:
    """
    Compute the weighted combined score.

    combined_score = (SEVERITY_WEIGHT x severity_score)
                   + (URGENCY_WEIGHT  x urgency_score)

    Both inputs must already be normalised to [0.0, 1.0].
    """
    return round(
        (SEVERITY_WEIGHT * severity_score) + (URGENCY_WEIGHT * urgency_score),
        4,
    )


def _score_to_priority(combined_score: float) -> str:
    """Map a combined score in [0.0, 1.0] to a priority label P1-P4."""
    if combined_score >= THRESHOLD_P1:
        return "P1"
    elif combined_score >= THRESHOLD_P2:
        return "P2"
    elif combined_score >= THRESHOLD_P3:
        return "P3"
    else:
        return "P4"


def _higher_priority(p1: str, p2: str) -> str:
    """Return whichever priority is higher (lower P number)."""
    rank1 = PRIORITY_RANK.get(p1, 99)
    rank2 = PRIORITY_RANK.get(p2, 99)
    return p1 if rank1 <= rank2 else p2


def _build_reason(
    urgency_label: str,
    severity_label: str,
    combined_score: float,
    final_priority: str,
    score_priority: str,
) -> str:
    """
    Produce a human-readable explanation of why the priority was assigned.
    """
    if urgency_label == "CRITICAL" or severity_label == "CRITICAL":
        parts = []
        if urgency_label == "CRITICAL":
            parts.append("critical urgency")
        if severity_label == "CRITICAL":
            parts.append("critical severity")
        return "Critical override: " + " and ".join(parts)

    overridden = final_priority != score_priority
    reason = (
        f"Combined score {combined_score:.3f} "
        f"(severity {severity_label.lower()}, urgency {urgency_label.lower()})"
    )
    if overridden:
        reason += f"; escalated from {score_priority} by label-based override"
    return reason


# ============================================================
# PUBLIC API
# ============================================================

def process_complaint(
    complaint: str,
    status: str = "Open",
) -> dict:
    """
    Classify a telecom complaint and return a structured priority result.

    Parameters
    ----------
    complaint : str
        The full text of the customer complaint.
    status : str, optional
        The ticket status (e.g. "Open", "Pending", "Closed").
        Defaults to "Open". Passed to the urgency engine for context.

    Returns
    -------
    dict with the following keys:
        complaint      : str   - the input complaint text
        urgency        : str   - canonical urgency label (CRITICAL/HIGH/MEDIUM/LOW/NEUTRAL)
        urgency_score  : float - normalised urgency score [0.0, 1.0]
        severity       : str   - canonical severity label (CRITICAL/HIGH/MEDIUM/LOW)
        severity_score : float - normalised severity score [0.0, 1.0]
        priority       : str   - final priority level (P1/P2/P3/P4)
        priority_score : float - combined weighted score [0.0, 1.0]
        priority_reason: str   - human-readable explanation

    Notes
    -----
    - Both models are loaded lazily on first call and cached for all
      subsequent calls (singleton pattern).
    - If either model is unavailable, safe fallback values are used and
      the function still returns a valid dict.
    - The returned priority is ALWAYS one of P1, P2, P3, or P4.
    """
    complaint_str = str(complaint).strip() if complaint else ""
    status_str = str(status).strip() if status else "Open"

    # --------------------------------------------------------
    # 1. Collect urgency
    # --------------------------------------------------------
    urgency_label, urgency_score = _get_urgency(complaint_str, status_str)

    # --------------------------------------------------------
    # 2. Collect severity
    # --------------------------------------------------------
    severity_label, severity_score = _get_severity(complaint_str)

    # --------------------------------------------------------
    # 3. Critical fast-path (spec rule 1)
    # --------------------------------------------------------
    combined_score = _compute_combined_score(severity_score, urgency_score)

    if urgency_label == "CRITICAL" or severity_label == "CRITICAL":
        # Override to P1 regardless of scores
        final_priority = "P1"
        score_priority = _score_to_priority(combined_score)
        reason = _build_reason(
            urgency_label, severity_label, combined_score,
            final_priority, score_priority,
        )
        return {
            "complaint":       complaint_str,
            "urgency":         urgency_label,
            "urgency_score":   urgency_score,
            "severity":        severity_label,
            "severity_score":  severity_score,
            "priority":        final_priority,
            "priority_score":  combined_score,
            "priority_reason": reason,
        }

    # --------------------------------------------------------
    # 4. Score-based priority (spec rules 2-4)
    # --------------------------------------------------------
    score_priority = _score_to_priority(combined_score)

    # --------------------------------------------------------
    # 5 & 6. Label-based override: take the highest priority
    #         from score, urgency label, severity label
    # --------------------------------------------------------
    urgency_label_priority  = LABEL_TO_PRIORITY.get(urgency_label,  "P4")
    severity_label_priority = LABEL_TO_PRIORITY.get(severity_label, "P4")

    final_priority = score_priority
    final_priority = _higher_priority(final_priority, urgency_label_priority)
    final_priority = _higher_priority(final_priority, severity_label_priority)

    # --------------------------------------------------------
    # 7. Safety guard: ensure result is always in P1-P4
    # --------------------------------------------------------
    if final_priority not in ("P1", "P2", "P3", "P4"):
        final_priority = "P4"

    reason = _build_reason(
        urgency_label, severity_label, combined_score,
        final_priority, score_priority,
    )

    return {
        "complaint":       complaint_str,
        "urgency":         urgency_label,
        "urgency_score":   urgency_score,
        "severity":        severity_label,
        "severity_score":  severity_score,
        "priority":        final_priority,
        "priority_score":  combined_score,
        "priority_reason": reason,
    }


# ============================================================
# STANDALONE DEMO
# ============================================================

if __name__ == "__main__":
    import json

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    demo_complaints = [
        (
            "My router is on fire and I cannot call 911 - this is a life-threatening emergency!",
            "Open",
        ),
        (
            "Internet has been completely down for 10 days. I contacted support 5 times and nobody has fixed it.",
            "Open",
        ),
        (
            "I am being double-billed and Comcast refuses to process my refund. This is fraudulent.",
            "Open",
        ),
        (
            "My internet speed has been slow since last week. It is not as advertised.",
            "Open",
        ),
        (
            "How do I change my Wi-Fi password?",
            "Open",
        ),
    ]

    print("\n" + "=" * 60)
    print("TELECOM COMPLAINT PRIORITY MODEL - DEMO")
    print("=" * 60)

    for complaint, status in demo_complaints:
        result = process_complaint(complaint, status)
        print("\n" + "-" * 60)
        print(f"COMPLAINT  : {result['complaint'][:80]}...")
        print(f"URGENCY    : {result['urgency']} (score={result['urgency_score']:.4f})")
        print(f"SEVERITY   : {result['severity']} (score={result['severity_score']:.4f})")
        print(f"PRIORITY   : {result['priority']} - {PRIORITY_DESCRIPTIONS[result['priority']]}")
        print(f"P-SCORE    : {result['priority_score']:.4f}")
        print(f"REASON     : {result['priority_reason']}")
