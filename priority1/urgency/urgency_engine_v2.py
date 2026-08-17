import os
import torch

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification
)

from urgency_rules_v2 import calculate_rule_urgency


# ============================================================
# LOAD DISTILBERT MODEL
# ============================================================

MODEL_NAME = "naman9705/signal-cx-urgency-distilbert"

print("Loading DistilBERT urgency model...")

tokenizer = AutoTokenizer.from_pretrained(
    MODEL_NAME
)

model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME
)

model.eval()

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

model.to(DEVICE)


# ============================================================
# LABEL MAPPING
# ============================================================

# Your trained model uses these labels:
# 0 = LOW
# 1 = MEDIUM
# 2 = HIGH
# 3 = CRITICAL

LABELS = {
    0: "LOW",
    1: "MEDIUM",
    2: "HIGH",
    3: "CRITICAL"
}


# ============================================================
# ML URGENCY SCORE
# ============================================================

def calculate_ml_urgency(
    low_probability,
    medium_probability,
    high_probability,
    critical_probability
):
    """
    Convert four-class ML probabilities into
    a continuous urgency score.

    LOW      = -1.0
    MEDIUM   = -0.25
    HIGH     =  0.50
    CRITICAL =  1.0
    """

    score = (
        (low_probability * -1.0)
        + (medium_probability * -0.25)
        + (high_probability * 0.50)
        + (critical_probability * 1.0)
    )

    return max(
        -1.0,
        min(1.0, score)
    )


# ============================================================
# FINAL DESCRIPTION
# ============================================================

def get_final_description(
    score,
    emergency=False
):

    if emergency:
        return "CRITICAL"

    if score < -0.50:
        return "LOW"

    elif score < 0.15:
        return "MEDIUM"

    elif score < 0.70:
        return "HIGH"

    else:
        return "CRITICAL"


# ============================================================
# DISTILBERT PREDICTION
# ============================================================

def predict_ml_urgency(complaint):

    inputs = tokenizer(
        str(complaint),
        return_tensors="pt",
        truncation=True,
        max_length=256
    )

    inputs = {
        key: value.to(DEVICE)
        for key, value in inputs.items()
    }

    # DistilBERT does not use token_type_ids.
    # Newer versions of transformers may include it in the tokenizer output,
    # causing a forward() error. Strip it defensively.
    inputs.pop("token_type_ids", None)

    with torch.no_grad():

        outputs = model(
            **inputs
        )

    probabilities = torch.softmax(
        outputs.logits,
        dim=-1
    )[0]

    probabilities = probabilities.cpu().numpy()

    probability_map = {}

    for index, probability in enumerate(
        probabilities
    ):

        label = LABELS.get(
            index,
            f"LABEL_{index}"
        )

        probability_map[label] = float(
            probability
        )

    prediction_index = int(
        probabilities.argmax()
    )

    ml_prediction = LABELS.get(
        prediction_index,
        f"LABEL_{prediction_index}"
    )

    return (
        ml_prediction,
        probability_map
    )


# ============================================================
# HYBRID PREDICTION
# ============================================================

def predict_urgency(
    complaint,
    status="Open"
):

    # --------------------------------------------------------
    # RULE ENGINE V2
    # --------------------------------------------------------

    rule_result = calculate_rule_urgency(
        complaint,
        status
    )

    rule_urgency = rule_result[
        "rule_urgency"
    ]

    signals = rule_result[
        "signals"
    ]


    # --------------------------------------------------------
    # DISTILBERT ML MODEL
    # --------------------------------------------------------

    ml_prediction, probability_map = (
        predict_ml_urgency(
            complaint
        )
    )


    low_probability = probability_map.get(
        "LOW",
        0.0
    )

    medium_probability = probability_map.get(
        "MEDIUM",
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


    # --------------------------------------------------------
    # ML SCORE
    # --------------------------------------------------------

    ml_urgency = calculate_ml_urgency(
        low_probability,
        medium_probability,
        high_probability,
        critical_probability
    )


    # --------------------------------------------------------
    # HYBRID SCORE
    # --------------------------------------------------------

    # Emergency always overrides everything.

    if signals.get(
        "emergency",
        0
    ) == 1:

        hybrid_urgency = 1.0

    else:

        # ML = 60%
        # Rules = 40%

        hybrid_urgency = (
            (ml_urgency * 0.60)
            +
            (rule_urgency * 0.40)
        )


    # --------------------------------------------------------
    # LIMIT SCORE
    # --------------------------------------------------------

    hybrid_urgency = max(
        -1.0,
        min(
            1.0,
            hybrid_urgency
        )
    )


    # --------------------------------------------------------
    # FINAL DESCRIPTION
    # --------------------------------------------------------

    description = get_final_description(
        hybrid_urgency,
        emergency=(
            signals.get(
                "emergency",
                0
            ) == 1
        )
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

            "MEDIUM": round(
                float(medium_probability),
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

    print(
        "\n========================================"
    )

    print(
        "TELECOM HYBRID URGENCY ENGINE V2"
    )

    print(
        "========================================"
    )

    complaint = input(
        "\nEnter customer complaint: "
    ).strip()

    status = input(
        "Enter status (Open/Closed/Solved/Pending): "
    ).strip()


    try:

        result = predict_urgency(
            complaint,
            status
        )

    except Exception as e:

        print(
            "\nERROR:"
        )

        print(e)

        raise


    print(
        "\n========================================"
    )

    print(
        "HYBRID URGENCY RESULT"
    )

    print(
        "========================================"
    )


    print(
        "\nComplaint:"
    )

    print(
        result["complaint"]
        if "complaint" in result
        else complaint
    )


    print(
        "\nRule Urgency:"
    )

    print(
        result["rule_urgency"]
    )


    print(
        "\nML Prediction:"
    )

    print(
        result["ml_prediction"]
    )


    print(
        "\nML Probabilities:"
    )

    for label, probability in result[
        "ml_probabilities"
    ].items():

        print(
            f"{label}: {probability:.4f}"
        )


    print(
        "\nML Urgency:"
    )

    print(
        result["ml_urgency"]
    )


    print(
        "\nFinal Hybrid Urgency:"
    )

    print(
        result["hybrid_urgency"]
    )


    print(
        "\nDescription:"
    )

    print(
        result["description"]
    )