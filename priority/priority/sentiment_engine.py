from transformers import pipeline


# ============================================================
# SENTIMENT ENGINE
# ============================================================

emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None,
    device=-1
)


EMOTION_TO_SENTIMENT = {

    "anger": "NEGATIVE",
    "disgust": "NEGATIVE",
    "fear": "NEGATIVE",
    "sadness": "NEGATIVE",

    "joy": "POSITIVE",

    "neutral": "NEUTRAL",
    "surprise": "NEUTRAL"
}


def predict_sentiment(complaint):

    results = emotion_model(
        str(complaint),
        truncation=True
    )[0]

    results = sorted(
        results,
        key=lambda x: x["score"],
        reverse=True
    )

    top_emotion = results[0]["label"].lower()
    emotion_score = float(results[0]["score"])

    sentiment = EMOTION_TO_SENTIMENT.get(
        top_emotion,
        "NEUTRAL"
    )

    return {
        "sentiment": sentiment,
        "emotion": top_emotion,
        "confidence": round(emotion_score, 4)
    }


# ============================================================
# TEST
# ============================================================

if __name__ == "__main__":

    print("\n========================================")
    print("TELECOM SENTIMENT ENGINE")
    print("========================================")

    complaint = input(
        "Enter customer complaint: "
    )

    result = predict_sentiment(complaint)

    print("\n========================================")
    print("SENTIMENT RESULT")
    print("========================================")

    print("Complaint:")
    print(complaint)

    print("\nEmotion:")
    print(result["emotion"])

    print("Sentiment:")
    print(result["sentiment"])

    print("Confidence:")
    print(result["confidence"])
    