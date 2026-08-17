"""Configuration for the complaint priority model."""


# PRIORITY LABELS

# Ordered from highest to lowest priority
PRIORITY_LABELS = ["P1", "P2", "P3", "P4"]

PRIORITY_DESCRIPTIONS = {
    "P1": "Critical",
    "P2": "High",
    "P3": "Medium",
    "P4": "Low",
}


# SCORE WEIGHTS
#
# combined_score = (SEVERITY_WEIGHT x severity_score)
#                + (URGENCY_WEIGHT x urgency_score)
#
# Severity dominates (60%) because impact on service matters more than
# the customer's expressed urgency tone.
SEVERITY_WEIGHT: float = 0.40
URGENCY_WEIGHT: float = 0.40
SENTIMENT_WEIGHT: float = 0.20


# COMBINED-SCORE THRESHOLDS
#
# Raised from original (0.85 / 0.65 / 0.40) to create a more balanced
# distribution across P1-P4. Previously most complaints landed in P2
# because 0.65 was too easy to exceed with moderate severity + high urgency.
#
# Target real-world distribution:
#   P1 >= 0.88  -> ~10%  (true emergencies / CRITICAL label override)
#   P2 >= 0.68  -> ~20%  (serious: fraud, full outage, multi-day failure)
#   P3 >= 0.48  -> ~40%  (noticeable: slow speeds, billing, quality issues)
#   P4  < 0.48  -> ~30%  (informational, low-impact, general queries)
THRESHOLD_P1: float = 0.88   # combined_score >= 0.88 -> P1
THRESHOLD_P2: float = 0.68   # combined_score >= 0.68 -> P2
THRESHOLD_P3: float = 0.48   # combined_score >= 0.48 -> P3
# combined_score <  0.48 -> P4


# LABEL -> PRIORITY-LEVEL MAPPING  (Step 7 escalation guard)
#
# This mapping is used ONLY as an escalation guard — it can raise
# the score-based priority but never lower it.
#
# KEY CHANGE: HIGH urgency label now maps to P3 (was P2).
# Rationale: Many moderate complaints trigger a HIGH urgency label via
# the rule engine (e.g. a simple service quality complaint with duration).
# Mapping HIGH -> P2 was forcing nearly every such complaint to P2 even
# when the numeric combined score sat comfortably in P3 territory.
# P2 is now reserved for genuinely high combined scores (>= 0.72) or for
# complaints where CRITICAL is explicitly detected.
LABEL_TO_PRIORITY = {
    "CRITICAL": "P1",
    "HIGH":     "P3",   # was P2 — main bias fix
    "MEDIUM":   "P4",   # was P3
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


# URGENCY LABEL NORMALISATION

URGENCY_LABEL_MAP = {
    "CRITICAL": "CRITICAL",
    "HIGH":     "HIGH",
    "MEDIUM":   "MEDIUM",
    "NEUTRAL":  "NEUTRAL",
    "LOW":      "LOW",
}


# SEVERITY LABEL NORMALISATION

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


# LABEL -> NORMALISED SCORE  (0.0 - 1.0)
#
# Used as a fallback when the raw numeric score is unavailable.
# Reduced HIGH score (0.75 -> 0.62) so that HIGH-urgency label-only
# fallback no longer pushes the combined score over the P2 threshold
# on its own. CRITICAL kept at 1.0 to preserve the critical fast-path.
URGENCY_LABEL_TO_SCORE = {
    "CRITICAL": 1.00,
    "HIGH":     0.62,   # was 0.75
    "MEDIUM":   0.38,   # was 0.50
    "NEUTRAL":  0.15,   # was 0.25
    "LOW":      0.00,
}

SEVERITY_LABEL_TO_SCORE = {
    "CRITICAL": 1.00,
    "HIGH":     0.70,   # was 0.75
    "MEDIUM":   0.40,   # was 0.50
    "LOW":      0.00,
}


# URGENCY SCORE NORMALISATION

# The urgency engine returns hybrid_urgency in [-1.0, +1.0].
# Normalise to [0.0, 1.0]:  normalised = (raw + 1.0) / 2.0
URGENCY_RAW_MIN: float = -1.0
URGENCY_RAW_MAX: float =  1.0


# SEVERITY SCORE DERIVATION
#
# Weighted sum of class probabilities -> single 0-1 score.
# Reduced HIGH class weight (0.67 -> 0.55) to create a more gradual
# progression. Previously a complaint predicted as "Severe" with high
# confidence alone could push severity_score to ~0.67 and immediately
# land in P2 territory after the 60% weight multiplication.
SEVERITY_CLASS_WEIGHTS = {
    "LOW":      0.00,
    "MEDIUM":   0.25,   # was 0.33
    "HIGH":     0.55,   # was 0.67
    "CRITICAL": 1.00,   # unchanged — critical must stay critical
}


# FALLBACK DEFAULTS

FALLBACK_URGENCY_LABEL: str   = "LOW"
FALLBACK_URGENCY_SCORE: float = 0.0

FALLBACK_SEVERITY_LABEL: str   = "LOW"
FALLBACK_SEVERITY_SCORE: float = 0.0
