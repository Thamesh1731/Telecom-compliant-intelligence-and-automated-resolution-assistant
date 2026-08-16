"""
priority_config.py
==================
Configuration constants for the telecom complaint priority model.

Contains:
- Priority level labels (P1 - P4)
- Combined-score weights for severity and urgency
- Threshold boundaries that map combined scores to priority levels
- Label-to-normalised-score mappings for urgency and severity outputs
- Human-readable label normalisation maps
"""


# ============================================================
# PRIORITY LABELS
# ============================================================

# Ordered from highest to lowest priority
PRIORITY_LABELS = ["P1", "P2", "P3", "P4"]

PRIORITY_DESCRIPTIONS = {
    "P1": "Critical",
    "P2": "High",
    "P3": "Medium",
    "P4": "Low",
}


# ============================================================
# SCORE WEIGHTS
# ============================================================

# combined_score = (SEVERITY_WEIGHT x severity_score)
#                + (URGENCY_WEIGHT x urgency_score)
SEVERITY_WEIGHT: float = 0.60
URGENCY_WEIGHT: float = 0.40


# ============================================================
# COMBINED-SCORE THRESHOLDS
# ============================================================

# All scores are normalised to [0.0, 1.0] before comparison.
THRESHOLD_P1: float = 0.85   # combined_score >= 0.85 -> P1
THRESHOLD_P2: float = 0.65   # combined_score >= 0.65 -> P2
THRESHOLD_P3: float = 0.40   # combined_score >= 0.40 -> P3
# combined_score <  0.40 -> P4


# ============================================================
# LABEL -> PRIORITY-LEVEL MAPPING
# ============================================================

LABEL_TO_PRIORITY = {
    "CRITICAL": "P1",
    "HIGH":     "P2",
    "MEDIUM":   "P3",
    "LOW":      "P4",
    "NEUTRAL":  "P4",
}

# Priority numeric rank: lower number = higher priority
PRIORITY_RANK = {
    "P1": 1,
    "P2": 2,
    "P3": 3,
    "P4": 4,
}


# ============================================================
# URGENCY LABEL NORMALISATION
# ============================================================

URGENCY_LABEL_MAP = {
    "CRITICAL": "CRITICAL",
    "HIGH":     "HIGH",
    "MEDIUM":   "MEDIUM",
    "NEUTRAL":  "NEUTRAL",
    "LOW":      "LOW",
}


# ============================================================
# SEVERITY LABEL NORMALISATION
# ============================================================

SEVERITY_LABEL_MAP = {
    "Mild":     "LOW",
    "Moderate": "MEDIUM",
    "Severe":   "HIGH",
    "Critical": "CRITICAL",
    "MILD":     "LOW",
    "MODERATE": "MEDIUM",
    "SEVERE":   "HIGH",
    "CRITICAL": "CRITICAL",
}


# ============================================================
# LABEL -> NORMALISED SCORE  (0.0 - 1.0)
# ============================================================

URGENCY_LABEL_TO_SCORE = {
    "CRITICAL": 1.00,
    "HIGH":     0.75,
    "MEDIUM":   0.50,
    "NEUTRAL":  0.25,
    "LOW":      0.00,
}

SEVERITY_LABEL_TO_SCORE = {
    "CRITICAL": 1.00,
    "HIGH":     0.75,
    "MEDIUM":   0.50,
    "LOW":      0.00,
}


# ============================================================
# URGENCY SCORE NORMALISATION
# ============================================================

# The urgency engine returns hybrid_urgency in [-1.0, +1.0].
# Normalise to [0.0, 1.0]:  normalised = (raw + 1.0) / 2.0
URGENCY_RAW_MIN: float = -1.0
URGENCY_RAW_MAX: float =  1.0


# ============================================================
# SEVERITY SCORE DERIVATION
# ============================================================

# Weighted sum of class probabilities -> single 0-1 score
SEVERITY_CLASS_WEIGHTS = {
    "LOW":      0.00,
    "MEDIUM":   0.33,
    "HIGH":     0.67,
    "CRITICAL": 1.00,
}


# ============================================================
# FALLBACK DEFAULTS
# ============================================================

FALLBACK_URGENCY_LABEL: str   = "LOW"
FALLBACK_URGENCY_SCORE: float = 0.0

FALLBACK_SEVERITY_LABEL: str   = "LOW"
FALLBACK_SEVERITY_SCORE: float = 0.0
