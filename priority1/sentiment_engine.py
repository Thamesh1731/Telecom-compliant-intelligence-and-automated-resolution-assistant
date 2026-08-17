"""Hosted sentiment scoring for complaint priority classification."""

import os

import httpx


DEFAULT_MODEL = "distilbert/distilbert-base-uncased-finetuned-sst-2-english"
DEFAULT_ENDPOINT = "https://router.huggingface.co/hf-inference/models/"


def _endpoint() -> str:
    configured = os.getenv("SENTIMENT_API_URL", "").strip()
    if configured:
        return configured
    model = os.getenv("SENTIMENT_MODEL", DEFAULT_MODEL).strip()
    return DEFAULT_ENDPOINT + model


def classify_sentiment(text: str) -> tuple[str, float]:
    """Return a label and negative-probability score in the range 0.0-1.0."""
    token = os.getenv("HF_TOKEN", "").strip()
    if not token or os.getenv("SENTIMENT_ENABLED", "true").lower() != "true":
        return "NEUTRAL", 0.0

    try:
        response = httpx.post(
            _endpoint(),
            headers={"Authorization": f"Bearer {token}"},
            json={"inputs": str(text), "parameters": {"top_k": 3}},
            timeout=float(os.getenv("SENTIMENT_TIMEOUT_SECONDS", "10")),
        )
        response.raise_for_status()
        payload = response.json()
        scores = payload[0] if payload and isinstance(payload[0], list) else payload
        score_map = {
            str(item.get("label", "")).upper(): float(item.get("score", 0.0))
            for item in scores
            if isinstance(item, dict)
        }
        negative_score = max(0.0, min(1.0, score_map.get("NEGATIVE", 0.0)))
        label = max(score_map, key=score_map.get, default="NEUTRAL")
        return label if label in {"NEGATIVE", "NEUTRAL", "POSITIVE"} else "NEUTRAL", round(negative_score, 4)
    except Exception:
        return "NEUTRAL", 0.0
