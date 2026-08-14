"""
main.py

Lightweight client. Loads NO models -- just sends each complaint/feedback
to model_server.py over HTTP, so it starts instantly.

Requires model_server.py to already be running in another terminal:
    python model_server.py
"""

import json
import sys
import urllib.request
import urllib.error

SERVER_URL = "http://127.0.0.1:8000"


def send_post_request(path, data):
    url = f"{SERVER_URL}{path}"
    req = urllib.request.Request(
        url,
        data=json.dumps(data).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.URLError:
        print(f"\nError: Could not connect to the model server at {SERVER_URL}.")
        print("Start it first in another terminal with: python model_server.py")
        sys.exit(1)
    except Exception as e:
        print(f"\nError communicating with server: {e}")
        return None


def main():
    print("\n==============================================")
    print("Telecom RAG + LLM Client (Model-Persistence Version)")
    print("==============================================\n")

    while True:
        complaint = input("Enter customer complaint (or 'exit' to quit): ").strip()
        if not complaint:
            continue
        if complaint.lower() == "exit":
            print("Goodbye!")
            break

        print("\nSending query to server...")
        response = send_post_request("/query", {"complaint": complaint})
        if not response or not response.get("found"):
            print("No matching knowledge found or server error.")
            print("-" * 60 + "\n")
            continue

        complaint_id = response.get("complaint_id")
        source = response.get("source")
        category = response.get("category")
        subcategory = response.get("subcategory")

        print(f"\nSource: {source}")
        print(f"Category: {category} / {subcategory}")

        if source == "verified_positive":
            matches = response.get("matches", [])
            print(f"\n{len(matches)} historical match(es) found:")
            for i, m in enumerate(matches, 1):
                print(f"\n--- Match {i} (similarity {m['similarity']:.4f}, cross-score {m['cross_score']:.4f}) ---")
                print(f"Similar complaint: {m['complaint']}")

        print("\nSolution:")
        print(response.get("solution"))

        feedback = input("\nEnter customer feedback after resolution: ").strip()
        if not feedback:
            print("No feedback entered. Skipping feedback submission.")
            print("-" * 60 + "\n")
            continue

        feedback_res = send_post_request("/feedback", {
            "complaint_id": complaint_id,
            "feedback": feedback
        })

        if feedback_res:
            print(f"\nFeedback result: {feedback_res}")
            if not feedback_res.get("stored") and "negative" in feedback_res.get("reason", ""):
                print("(Negative feedback was discarded silently and did not modify database/history)")
        print("-" * 60 + "\n")


if __name__ == "__main__":
    main()
