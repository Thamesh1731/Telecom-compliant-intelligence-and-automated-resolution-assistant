import sys
from pathlib import Path

# ------------------------------------------------------------
# Import urgency engine
# ------------------------------------------------------------

URGENCY_DIR = Path(__file__).resolve().parent.parent / "urgency"
sys.path.insert(0, str(URGENCY_DIR))

from urgency_engine_v2 import predict_urgency
# ------------------------------------------------------------
# Import sentiment engine
# ------------------------------------------------------------

from sentiment_engine import predict_sentiment


# ============================================================
# PRIORITY CALCULATION
# ============================================================

def calculate_priority(
    complaint,
    sentiment,
    urgency_description,
    urgency_score,
):
    sentiment = str(sentiment).upper()
    urgency_description = str(urgency_description).upper()

    # --------------------------------------------------------
    # CRITICAL → P1
    # --------------------------------------------------------

    if urgency_description == "CRITICAL":

        return {
            "priority": "P1",
            "priority_score": 1.0,
            "reason": "Critical urgency requires immediate attention"
        }

    # --------------------------------------------------------
    # HIGH → P2
    # --------------------------------------------------------

    if urgency_description == "HIGH":

        if sentiment == "NEGATIVE":

            return {
                "priority": "P2",
                "priority_score": 0.85,
                "reason": "High urgency with negative customer sentiment"
            }

        return {
            "priority": "P2",
            "priority_score": 0.75,
            "reason": "High urgency complaint"
        }

    # --------------------------------------------------------
    # NEUTRAL → P3
    # --------------------------------------------------------

    if urgency_description == "NEUTRAL":

        if sentiment == "NEGATIVE":

            return {
                "priority": "P3",
                "priority_score": 0.55,
                "reason": "Negative sentiment requires standard attention"
            }

        return {
            "priority": "P3",
            "priority_score": 0.45,
            "reason": "Standard complaint"
        }

    # --------------------------------------------------------
    # LOW → P4
    # --------------------------------------------------------

    if urgency_description == "LOW":

        return {
            "priority": "P4",
            "priority_score": 0.20,
            "reason": "Low urgency complaint"
        }

    # --------------------------------------------------------
    # FALLBACK
    # --------------------------------------------------------

    return {
        "priority": "P3",
        "priority_score": 0.45,
        "reason": "Default standard priority"
    }

   
# ============================================================
# COMPLETE PIPELINE
# ============================================================

def process_complaint(complaint, status="Open"):

    # --------------------------------------------------------
    # INPUT VALIDATION
    # --------------------------------------------------------

    if not complaint or not complaint.strip():
        raise ValueError(
            "Complaint cannot be empty. Please enter a customer complaint."
        )

    if not status or not status.strip():
        raise ValueError(
            "Status cannot be empty. Please enter Open, Closed, Solved, or Pending."
        )

    valid_statuses = {
        "open",
        "closed",
        "solved",
        "pending"
    }

    status = status.strip()

    if status.lower() not in valid_statuses:
        raise ValueError(
            "Invalid status. Use Open, Closed, Solved, or Pending."
        )

    # --------------------------------------------------------
    # SENTIMENT
    # --------------------------------------------------------

    sentiment_result = predict_sentiment(complaint)

    sentiment = sentiment_result["sentiment"]

    # --------------------------------------------------------
    # URGENCY
    # --------------------------------------------------------

    urgency_result = predict_urgency(
        complaint,
        status
    )

    urgency_description = urgency_result["description"]
    urgency_score = urgency_result["hybrid_urgency"]

    # --------------------------------------------------------
    # PRIORITY
    # --------------------------------------------------------

    priority_result = calculate_priority(
        complaint,
        sentiment,
        urgency_description,
        urgency_score
    )

    # --------------------------------------------------------
    # FINAL RESULT 
    # --------------------------------------------------------

    return {
        "complaint": complaint,

        "sentiment": sentiment,
        "emotion": sentiment_result["emotion"],
        "sentiment_confidence": sentiment_result["confidence"],

        "urgency": urgency_description,
        "urgency_score": urgency_score,

        "priority": priority_result["priority"],
        "priority_score": priority_result["priority_score"],
        "priority_reason": priority_result["reason"]
    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print("\n========================================")
    print("TELECOM COMPLAINT PRIORITY SYSTEM")
    print("========================================")

    complaint = input(
        "Enter customer complaint: "
    ).strip()

    status = input(
       "Enter status (Open/Closed/Solved/Pending): "
    ).strip()

    try:
       result = process_complaint(
         complaint,
         status
       )

    except ValueError as e:
       print("\nERROR:")
       print(e)
       exit()


    print("\n========================================")
    print("FINAL RESULT")
    print("========================================")

    print("\nComplaint:")
    print(result["complaint"])

    print("\nSentiment:")
    print(result["sentiment"])

    print("Emotion:")
    print(result["emotion"])

    print("Sentiment Confidence:")
    print(result["sentiment_confidence"])

    print("\nUrgency:")
    print(result["urgency"])

    print("Urgency Score:")
    print(result["urgency_score"])

    print("\nPriority:")
    print(result["priority"])

    print("Priority Score:")
    print(result["priority_score"])

    print("Reason:")
    print(result["priority_reason"])