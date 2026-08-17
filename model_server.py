"""Resolver pipeline used by the FastAPI application."""

import re
import uuid
import json
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer

from retriever import (
    retrieve,
    normalize_category,
    classify_category,
)
from llm_reasoning import generate_solution
from resolver_retriever import find_resolver_solution

# CONFIG

# STEP 1: New complaint -> resolver base FIRST, LLM+KB fallback second

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





# HTTP SERVER — keeps all models resident, handles /query and /feedback

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
