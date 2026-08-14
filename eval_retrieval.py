import sys
import os

# Add current directory to path
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from retriever import retrieve, classify_category

ACTIONABLE_SECTIONS = {
    "Troubleshooting Procedure",
    "Resolution",
    "Recommended Action",
    "Human Agent Action",
    "Escalation Conditions",
    "Escalation",
    "Human Action",
    "Recommended Human Action"
}

# Evaluation dataset: complaint text mapped to acceptable document ID(s)
EVAL_DATA = [
    # Normal complaints
    {
        "complaint": "Internet slow",
        "expected": ["NET-02"]
    },
    {
        "complaint": "SIM not detected",
        "expected": ["SIM-04", "ACC-01"]
    },
    {
        "complaint": "Cannot make calls",
        "expected": ["CALL-03"]
    },
    {
        "complaint": "Cannot receive calls",
        "expected": ["CALL-02"]
    },
    # Paraphrased complaints
    {
        "complaint": "Every phone call gets disconnected after a few minutes.",
        "expected": ["CALL-04"]
    },
    {
        "complaint": "My calls keep cutting out.",
        "expected": ["CALL-04"]
    },
    {
        "complaint": "I am unable to receive incoming calls.",
        "expected": ["CALL-02"]
    },
    # Short/noisy complaints
    {
        "complaint": "calls dropping",
        "expected": ["CALL-04"]
    },
    {
        "complaint": "internet bad",
        "expected": ["NET-01", "NET-02", "NET-03", "NET-05"]
    },
    {
        "complaint": "sim not working",
        "expected": ["SIM-01", "SIM-04", "ACC-01"]
    },
    {
        "complaint": "call cutting again pls help",
        "expected": ["CALL-04"]
    },
    # Ambiguous complaints
    {
        "complaint": "My number isn't working.",
        "expected": ["CALL-01"]
    },
    {
        "complaint": "Network is not working.",
        "expected": ["MOB-01", "NET-01", "NET-05", "COV-01", "COV-02", "COV-03"]
    },
    # Regression test cases
    {
        "complaint": "my internet drops randomly",
        "expected": ["NET-03"]
    },
    {
        "complaint": "my number isn't working after porting",
        "expected": ["NP-04", "NP-03"]
    },
    # Classifier-mismatch cases / Critical Acceptance
    {
        "complaint": "Calls keep dropping after five minutes.",
        "expected": ["CALL-04"]
    },
    {
        "complaint": "I cannot receive incoming calls.",
        "expected": ["CALL-02"]
    },
    {
        "complaint": "I cannot make outgoing calls.",
        "expected": ["CALL-03"]
    },
    {
        "complaint": "My internet is very slow.",
        "expected": ["NET-02"]
    },
    {
        "complaint": "My SIM is not detected.",
        "expected": ["SIM-04", "ACC-01"]
    },
    # Other diverse cases
    {
        "complaint": "I get charged too much when traveling abroad",
        "expected": ["ROAM-05"]
    },
    {
        "complaint": "can't connect to wifi on my phone",
        "expected": ["NET-04"]
    },
    {
        "complaint": "how do I change my mobile plan",
        "expected": ["PLN-04"]
    },
    {
        "complaint": "my recharge failed but money was deducted",
        "expected": ["PLN-01", "PLN-02"]
    },
    {
        "complaint": "want to port my number to your network",
        "expected": ["NP-01"]
    },
    {
        "complaint": "my number porting is delayed",
        "expected": ["NP-03"]
    },
    {
        "complaint": "someone did a SIM swap on my account without permission",
        "expected": ["SEC-02"]
    },
    {
        "complaint": "getting spam or phishing messages",
        "expected": ["SEC-04"]
    },
    {
        "complaint": "reporting my lost phone to block it",
        "expected": ["SEC-03"]
    },
    {
        "complaint": "cannot activate my new eSIM",
        "expected": ["SIM-02", "ACC-03"]
    }
]

def run_evaluation():
    print(f"Running evaluation on {len(EVAL_DATA)} test cases...\n")
    
    hits_at_1 = 0
    hits_at_3 = 0
    hits_at_5 = 0
    hits_actionable = 0
    
    print(f"{'Complaint':<55} | {'Expected':<12} | {'Top 1 Mapped':<15} | {'Rec@1':<5} | {'Rec@3':<5} | {'Rec@5':<5} | {'Actionable':<10}")
    print("-" * 128)
    
    for case in EVAL_DATA:
        complaint = case["complaint"]
        expected_ids = case["expected"]
        
        # Get classifier top predictions
        ranked_categories = classify_category(complaint)
        top_cat = ranked_categories[0][0] if ranked_categories else "None"
        
        # Retrieve top 5 chunks
        results = retrieve(complaint, top_k=5)
        
        # Extract unique document IDs retrieved
        retrieved_docs = []
        for r in results:
            doc_id = r.get("metadata", {}).get("document_id")
            if doc_id and doc_id not in retrieved_docs:
                retrieved_docs.append(doc_id)
        
        # Check recall
        r1 = any(doc in retrieved_docs[:1] for doc in expected_ids)
        r3 = any(doc in retrieved_docs[:3] for doc in expected_ids)
        r5 = any(doc in retrieved_docs[:5] for doc in expected_ids)
        
        # Check if at least one actionable section was retrieved from an expected doc
        has_actionable = False
        for r in results:
            doc_id = r.get("metadata", {}).get("document_id")
            section = r.get("metadata", {}).get("section_name", "")
            if doc_id in expected_ids and section in ACTIONABLE_SECTIONS:
                has_actionable = True
                break
        
        if r1: hits_at_1 += 1
        if r3: hits_at_3 += 1
        if r5: hits_at_5 += 1
        if has_actionable: hits_actionable += 1
        
        rec1_str = "PASS" if r1 else "FAIL"
        rec3_str = "PASS" if r3 else "FAIL"
        rec5_str = "PASS" if r5 else "FAIL"
        action_str = "PASS" if has_actionable else "FAIL"
        
        print(f"{complaint[:53]:<55} | {str(expected_ids):<12} | {top_cat[:13]:<15} | {rec1_str:<5} | {rec3_str:<5} | {rec5_str:<5} | {action_str:<10}")
        
        print("\nRetrieved Chunks details:")
        for idx, r in enumerate(results, 1):
            doc_id = r.get("metadata", {}).get("document_id")
            sect = r.get("metadata", {}).get("section_name", "Overview")
            score = round(r.get("final_score", 0.0), 4)
            print(f"  {idx}. {doc_id} | {sect:<25} (Score: {score})")
        print("=" * 128)
        
    total = len(EVAL_DATA)
    recall_at_1 = hits_at_1 / total
    recall_at_3 = hits_at_3 / total
    recall_at_5 = hits_at_5 / total
    actionable_rate = hits_actionable / total
    
    print("\n" + "=" * 50)
    print("EVALUATION METRICS:")
    print("=" * 50)
    print(f"Recall@1: {recall_at_1:.2%}")
    print(f"Recall@3: {recall_at_3:.2%}")
    print(f"Recall@5: {recall_at_5:.2%}")
    print(f"Actionable-Section Retrieval Rate: {actionable_rate:.2%}")
    print("=" * 50)

if __name__ == "__main__":
    run_evaluation()
