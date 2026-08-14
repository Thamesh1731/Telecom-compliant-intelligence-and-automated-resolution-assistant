"""
model_server.py

Loads ALL models exactly once (embedding model, complaint classifier,
sentiment model, cross-encoder reranker, Groq client) and keeps them
resident in memory behind a persistent HTTP server. This is the slow
part -- run it once and leave it running.

The lightweight client (main.py) sends each complaint/feedback as a
quick HTTP request instead of re-loading every model on every run.

Run this FIRST, and leave it running:
    python model_server.py

Then in a separate terminal, run the client as many times as you like:
    python main.py
"""

import re
import uuid
import json
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer

import torch
import chromadb
from transformers import pipeline
from sentence_transformers import CrossEncoder

from retriever import (
    embedding_model,
    retrieve,
    normalize_category,
    classify_category,
)
from llm_reasoning import generate_solution

# ============================================================
# CONFIG
# ============================================================

VERIFIED_DB_PATH = "chroma_db"
VERIFIED_COLLECTION_NAME = "verified_positive_cases"

SENTIMENT_MARGIN_THRESHOLD = 0.10

# Bi-encoder cosine similarity is a broad PRE-FILTER only (see the earlier
# "internet is down" vs "internet is slow" bug) -- the cross-encoder below
# is the real accept/reject gate.
SIMILARITY_THRESHOLD = 0.45

CROSS_ENCODER_MODEL = "cross-encoder/ms-marco-MiniLM-L-6-v2"
CROSS_ENCODER_THRESHOLD = 0.5

# ============================================================
# MODELS
# ============================================================

print("Loading sentiment model...")
sentiment_model = pipeline(
    "text-classification",
    model="nlptown/bert-base-multilingual-uncased-sentiment",
    top_k=None
)

print("Loading cross-encoder reranker...")
cross_encoder = CrossEncoder(CROSS_ENCODER_MODEL)


def bucket_label(star_label):
    stars = int(star_label[0])
    if stars <= 2:
        return "negative"
    elif stars == 3:
        return "neutral"
    else:
        return "positive"


def classify_with_margin(results, margin=SENTIMENT_MARGIN_THRESHOLD):
    bucket_scores = {"negative": 0.0, "neutral": 0.0, "positive": 0.0}
    for r in results:
        bucket_scores[bucket_label(r["label"])] += r["score"]

    ranked = sorted(bucket_scores.items(), key=lambda x: -x[1])
    top_bucket, top_score = ranked[0]
    second_bucket, second_score = ranked[1]
    gap = top_score - second_score

    label = "mixed" if gap < margin else top_bucket
    return label, gap


# ============================================================
# VECTOR STORE — separate collection, same Chroma instance/db
# ============================================================

client = chromadb.PersistentClient(path=VERIFIED_DB_PATH)

verified_positive = client.get_or_create_collection(
    name=VERIFIED_COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"}
)

pending_cases = {}


# ============================================================
# TWO-STAGE MATCHING: bi-encoder pre-filter + cross-encoder rerank
# ============================================================

def _rerank_with_cross_encoder(complaint_text, candidates):
    if not candidates:
        return []
    pairs = [(complaint_text, c["complaint"]) for c in candidates]
    scores = cross_encoder.predict(pairs, activation_fct=torch.nn.Sigmoid())
    for c, score in zip(candidates, scores):
        c["cross_score"] = float(score)
    candidates.sort(key=lambda c: -c["cross_score"])
    return [c for c in candidates if c["cross_score"] >= CROSS_ENCODER_THRESHOLD]


def _check_verified_positive_top_3(complaint_text, category):
    query_embedding = embedding_model.encode(complaint_text).tolist()
    where_filter = {"category": category} if category else None

    results = verified_positive.query(
        query_embeddings=[query_embedding],
        n_results=8,
        where=where_filter
    )

    if not results["ids"] or not results["ids"][0]:
        return []

    candidates = []
    for i in range(len(results["ids"][0])):
        similarity = 1 - results["distances"][0][i]
        if similarity >= SIMILARITY_THRESHOLD:
            candidates.append({
                "case_id": results["ids"][0][i],
                "similarity": similarity,
                "solution": results["metadatas"][0][i]["solution"],
                "category": results["metadatas"][0][i]["category"],
                "subcategory": results["metadatas"][0][i].get("subcategory"),
                "complaint": results["documents"][0][i]
            })

    reranked = _rerank_with_cross_encoder(complaint_text, candidates)
    return reranked[:3]


# ============================================================
# STEP 1: New complaint -> verified-positive FIRST, LLM+KB fallback second
# ============================================================

def handle_new_complaint(complaint_text, predicted_category=None):
    if predicted_category is None:
        ranked = classify_category(complaint_text)
        predicted_category = ranked[0][0]
    category = normalize_category(predicted_category)

    complaint_id = str(uuid.uuid4())

    # --- Try the verified-positive store first ---
    matches = _check_verified_positive_top_3(complaint_text, category)

    if matches:
        primary_match = matches[0]
        pending_cases[complaint_id] = {
            "complaint_text": complaint_text,
            "solution": primary_match["solution"],
            "category": primary_match["category"],
            "subcategory": primary_match["subcategory"],
            "source": "verified_positive",
            "matched_case_id": primary_match["case_id"],
        }
        return {
            "complaint_id": complaint_id,
            "found": True,
            "source": "verified_positive",
            "category": primary_match["category"],
            "subcategory": primary_match["subcategory"],
            "matches": matches,
            "solution": primary_match["solution"],
        }

    # --- Fall back to retrieve() + LLM synthesis ---
    results = retrieve(complaint_text, predicted_category=predicted_category, top_k=5)

    if not results:
        return {"complaint_id": None, "found": False, "reason": "no KB match found"}

    solution_text = generate_solution(complaint_text, results)
    top = results[0]

    pending_cases[complaint_id] = {
        "complaint_text": complaint_text,
        "solution": solution_text,
        "category": top["metadata"].get("category"),
        "subcategory": top["metadata"].get("subcategory"),
        "source": "llm_kb",
        "matched_case_id": None,
    }

    return {
        "complaint_id": complaint_id,
        "found": True,
        "source": "llm_kb",
        "category": top["metadata"].get("category"),
        "subcategory": top["metadata"].get("subcategory"),
        "solution": solution_text,
    }


# ============================================================
# STEP 2: Feedback arrives -> sentiment gate
# ============================================================

def handle_feedback(complaint_id, feedback_text):
    if complaint_id not in pending_cases:
        return {"stored": False, "reason": "unknown complaint_id"}

    case = pending_cases.pop(complaint_id)

    raw_scores = sentiment_model(feedback_text)[0]
    label, gap = classify_with_margin(raw_scores)

    if label == "negative":
        return {"stored": False, "reason": "negative feedback, discarded silently", "label": label, "gap": gap}

    if label not in ("positive", "neutral"):
        return {"stored": False, "reason": f"unsupported sentiment label: {label}", "label": label, "gap": gap}

    if case["source"] == "verified_positive":
        return _reconfirm_verified_case(case["matched_case_id"], gap)

    return _ingest_new_verified_case(case, gap)


def _reconfirm_verified_case(case_id, sentiment_gap):
    existing = verified_positive.get(ids=[case_id], include=["metadatas"])
    if not existing["ids"]:
        return {"stored": False, "reason": "matched case no longer exists"}

    metadata = existing["metadatas"][0]
    metadata["retrieved_count"] = metadata.get("retrieved_count", 0) + 1
    metadata["last_confirmed"] = datetime.now(timezone.utc).isoformat()
    metadata["last_sentiment_confidence"] = sentiment_gap

    verified_positive.update(ids=[case_id], metadatas=[metadata])

    return {
        "stored": True,
        "reused_existing_case": True,
        "case_id": case_id,
        "times_confirmed": metadata["retrieved_count"],
    }


def _ingest_new_verified_case(case, sentiment_gap):
    embedding = embedding_model.encode(case["complaint_text"]).tolist()
    case_id = str(uuid.uuid4())

    verified_positive.add(
        ids=[case_id],
        embeddings=[embedding],
        documents=[case["complaint_text"]],
        metadatas=[{
            "solution": case["solution"],
            "category": case["category"] or "unknown",
            "subcategory": case["subcategory"] or "unknown",
            "sentiment_confidence": sentiment_gap,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "retrieved_count": 1,
        }]
    )

    return {"stored": True, "reused_existing_case": False, "case_id": case_id, "category": case["category"]}


# ============================================================
# HTTP SERVER — keeps all models resident, handles /query and /feedback
# ============================================================

class RAGFeedbackHandler(BaseHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # suppress default request logging, keep terminal clean

    def _send_json(self, status, payload):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        try:
            data = json.loads(post_data.decode('utf-8'))
        except Exception:
            self._send_json(400, {"error": "Invalid JSON"})
            return

        if self.path == '/query':
            complaint = data.get("complaint")
            if not complaint:
                self._send_json(400, {"error": "Missing complaint parameter"})
                return
            res = handle_new_complaint(complaint)
            self._send_json(200, res)

        elif self.path == '/feedback':
            complaint_id = data.get("complaint_id")
            feedback = data.get("feedback")
            if not complaint_id or feedback is None:
                self._send_json(400, {"error": "Missing complaint_id or feedback parameter"})
                return
            res = handle_feedback(complaint_id, feedback)
            self._send_json(200, res)

        else:
            self._send_json(404, {"error": "Unknown endpoint"})


def run_server(port=8000):
    server = HTTPServer(('127.0.0.1', port), RAGFeedbackHandler)
    print(f"\nAll models loaded. RAG+LLM Model Server running on http://127.0.0.1:{port}")
    print("Leave this running, then use 'python main.py' in another terminal.\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        server.server_close()


if __name__ == "__main__":
    run_server()
