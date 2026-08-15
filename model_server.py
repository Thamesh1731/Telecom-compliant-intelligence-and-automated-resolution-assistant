"""
model_server.py

Provides the complaint-to-resolution pipeline used by the FastAPI backend.
The request scheduler in request_queue.py controls when this pipeline runs.
"""

import uuid

from retriever import (
    retrieve,
    normalize_category,
    classify_category,
)
from llm_reasoning import generate_solution
from resolver_retriever import find_resolver_solution

# ============================================================
# CONFIG
# ============================================================

# ============================================================
# STEP 1: New complaint -> resolver base FIRST, LLM+KB fallback second
# ============================================================

def handle_new_complaint(complaint_text, predicted_category=None):
    if predicted_category is None:
        ranked = classify_category(complaint_text)
        predicted_category = ranked[0][0]
    category = normalize_category(predicted_category)

    complaint_id = str(uuid.uuid4())

    # --- Search technician-approved resolver solutions first ---
    resolver_match = find_resolver_solution(complaint_text, category)
    if resolver_match:
        solution_text = generate_solution(complaint_text, [resolver_match])
        metadata = resolver_match["metadata"]
        return {
            "complaint_id": complaint_id,
            "found": True,
            "source": "resolver_base",
            "category": metadata.get("category", category),
            "subcategory": metadata.get("subcategory", "General"),
            "matches": [resolver_match],
            "solution": solution_text,
        }

    # --- Fall back to retrieve() + LLM synthesis ---
    results = retrieve(complaint_text, predicted_category=predicted_category, top_k=5)

    if not results:
        return {"complaint_id": None, "found": False, "reason": "no KB match found"}

    solution_text = generate_solution(complaint_text, results)
    top = results[0]

    return {
        "complaint_id": complaint_id,
        "found": True,
        "source": "llm_kb",
        "category": top["metadata"].get("category"),
        "subcategory": top["metadata"].get("subcategory"),
        "solution": solution_text,
    }




