import joblib

from urgency_rules_v2 import calculate_rule_urgency


# ============================================================
# LOAD ML MODEL
# ============================================================

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "urgency_ml_model_final.pkl")

model = joblib.load(MODEL_PATH)


# ============================================================
# ML URGENCY SCORE
# ============================================================

def calculate_ml_urgency(
    low_probability,
    high_probability,
    critical_probability
):

    score = (
        (low_probability * -1.0)
        + (high_probability * 0.5)
        + (critical_probability * 1.0)
    )

    return max(-1.0, min(1.0, score))


# ============================================================
# FINAL DESCRIPTION
# ============================================================

def get_final_description(score, emergency=False):

    if emergency:
        return "CRITICAL"

    if score < -0.50:
        return "LOW"

    elif score < 0.25:
        return "NEUTRAL"

    else:
        return "HIGH"


# ============================================================
# HYBRID PREDICTION
# ============================================================

def predict_urgency(complaint, status="Open"):

    # --------------------------------------------------------
    # RULE ENGINE V2
    # --------------------------------------------------------

    rule_result = calculate_rule_urgency(
        complaint,
        status
    )

    rule_urgency = rule_result["rule_urgency"]

    signals = rule_result["signals"]

    # --------------------------------------------------------
    # ML MODEL
    # --------------------------------------------------------

    probabilities = model.predict_proba(
        [complaint]
    )[0]

    probability_map = dict(
        zip(
            model.classes_,
            probabilities
        )
    )

    low_probability = probability_map.get(
        "LOW",
        0.0
    )

    high_probability = probability_map.get(
        "HIGH",
        0.0
    )

    critical_probability = probability_map.get(
        "CRITICAL",
        0.0
    )

    ml_prediction = model.predict(
        [complaint]
    )[0]

    # --------------------------------------------------------
    # ML SCORE
    # --------------------------------------------------------

    ml_urgency = calculate_ml_urgency(
        low_probability,
        high_probability,
        critical_probability
    )

    # --------------------------------------------------------
    # HYBRID SCORE
    # --------------------------------------------------------

    # Rule engine is the primary source of urgency.
    # ML provides supporting evidence but must not
    # downgrade a strong rule-based telecom signal.

    if signals.get("emergency", 0) == 1:

        hybrid_urgency = 1.0

    elif rule_urgency >= 0.50:

        hybrid_urgency = rule_urgency

    elif (
       signals.get("repeated_support", 0) == 1
       and signals.get("support_problem", 0) == 1
    ):

      hybrid_urgency = 0.50

    else:

       hybrid_urgency = (
          (rule_urgency * 0.70)
          + (ml_urgency * 0.30)
      )

    hybrid_urgency = max(
       -1.0,
       min(1.0, hybrid_urgency)
    )

    # --------------------------------------------------------
    # EMERGENCY OVERRIDE
    # --------------------------------------------------------

    if signals.get("emergency", 0) == 1:
        hybrid_urgency = 1.0

    # --------------------------------------------------------
    # FINAL DESCRIPTION
    # --------------------------------------------------------

    description = get_final_description(
        hybrid_urgency,
        emergency=signals.get("emergency", 0) == 1
    )

    # --------------------------------------------------------
    # RETURN RESULT
    # --------------------------------------------------------

    return {

        "rule_urgency": round(
            float(rule_urgency),
            4
        ),

        "ml_urgency": round(
            float(ml_urgency),
            4
        ),

        "hybrid_urgency": round(
            float(hybrid_urgency),
            4
        ),

        "description": description,

        "ml_prediction": ml_prediction,

        "ml_probabilities": {

            "LOW": round(
                float(low_probability),
                4
            ),

            "HIGH": round(
                float(high_probability),
                4
            ),

            "CRITICAL": round(
                float(critical_probability),
                4
            )
        },

        "signals": signals
    }


# ============================================================
# DIRECT TEST
# ============================================================

if __name__ == "__main__":

    complaint = input(
        "Enter customer complaint: "
    )

    status = input(
        "Enter status (Open/Closed/Solved/Pending): "
    )

    result = predict_urgency(
        complaint,
        status
    )

    print("\n========================================")
    print("HYBRID URGENCY RESULT")
    print("========================================")

    print("\nComplaint:")
    print(complaint)

    print("\nRule Urgency:")
    print(result["rule_urgency"])

    print("\nML Urgency:")
    print(result["ml_urgency"])

    print("\nFinal Hybrid Urgency:")
    print(result["hybrid_urgency"])

    print("\nDescription:")
    print(result["description"])