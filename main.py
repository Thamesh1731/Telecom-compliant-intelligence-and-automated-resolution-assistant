"""
main.py — Combined FastAPI Backend for Telecom RAG + LLM Resolution Engine with Admin Portal.

Features:
1. Technician resolver-base lookup followed by LLM formatting.
2. 3-level Hierarchical RAG Retrieval + Groq LLM Reasoning fallback.
3. Negative Feedback Pipeline (routes customer-reported failures to Admin for manual resolution).
4. Admin Portal Static File Mount (/admin) & Real-Time Escalations API (/api/admin/tickets).
5. Resolver Base storage for technician-provided solutions.
"""

import os
import sys
import uuid
import re
import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Environment & Path Configuration
# ---------------------------------------------------------------------------
_ENV_FILE = Path(__file__).parent / ".env"
load_dotenv(_ENV_FILE)

_PROJECT_ROOT = Path(__file__).parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))

# ---------------------------------------------------------------------------
# Import Model Server Logic & Pipelines
# ---------------------------------------------------------------------------
import model_server
from model_server import (
    handle_new_complaint,
)
from resolver_retriever import store_resolver_solution, resolver_solution_count

# ---------------------------------------------------------------------------
# Global State
# ---------------------------------------------------------------------------
ESCALATED_TICKETS: List[Dict[str, Any]] = []
NEGATIVE_FEEDBACK_ITEMS: List[Dict[str, Any]] = []

# Resolver Base paths
RESOLVER_BASE = _PROJECT_ROOT / "resolver_base"
RESOLVER_PENDING = RESOLVER_BASE / "pending"
RESOLVER_RESOLVED = RESOLVER_BASE / "resolved"
RESOLVER_PENDING.mkdir(parents=True, exist_ok=True)
RESOLVER_RESOLVED.mkdir(parents=True, exist_ok=True)

# Load any existing pending feedback items from disk on startup
def _load_pending_feedback():
    """Load previously persisted pending feedback items from resolver_base/pending/."""
    items = []
    if RESOLVER_PENDING.exists():
        for f in sorted(RESOLVER_PENDING.glob("*.json")):
            try:
                items.append(json.loads(f.read_text(encoding="utf-8")))
            except Exception:
                pass
    return items

NEGATIVE_FEEDBACK_ITEMS = _load_pending_feedback()

# ---------------------------------------------------------------------------
# FastAPI Application Setup
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Telecom Complaint Intelligence & Resolution API",
    version="3.0.0",
    description="Hierarchical RAG + Cross-Encoder Reranker + Negative Feedback Pipeline API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Pydantic Schemas
# ---------------------------------------------------------------------------
class ComplaintRequest(BaseModel):
    complaint: str
    city: Optional[str] = ""
    state: Optional[str] = ""
    zipCode: Optional[str] = ""
    email: Optional[str] = ""
    filingOnBehalf: Optional[str] = "No"

    @field_validator("complaint")
    @classmethod
    def complaint_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Complaint text cannot be empty.")
        if len(v) < 5:
            raise ValueError("Complaint text is too short. Please describe your issue in more detail.")
        return v


class NegativeFeedbackRequest(BaseModel):
    complaint_id: str
    complaint: str
    category: Optional[str] = "General"
    subcategory: Optional[str] = "General"
    ai_solution: str
    feedback: str


class ResolveFeedbackRequest(BaseModel):
    feedback_id: str
    resolved_solution: str


class SimpleQueryRequest(BaseModel):
    complaint: str


# ---------------------------------------------------------------------------
# Escalation Detection Helper
# ---------------------------------------------------------------------------
def check_escalation(complaint_text: str, solution_text: str) -> tuple[bool, Optional[str]]:
    """
    Check if ticket requires escalation based on:
    1. Direct LLM decision in solution output (e.g., 'Escalation: Yes')
    2. Explicit user complaint triggers in complaint_text (e.g., demanding supervisor, fraud, emergency)
    """
    solution_lower = solution_text.lower()
    
    # 1. Check if LLM explicitly declared 'Escalation: Yes'
    if re.search(r"escalation:\s*yes", solution_lower):
        reason_match = re.search(r"escalation reason:\s*(.*?)(?=\n\w+:|$)", solution_text, re.IGNORECASE | re.DOTALL)
        reason = reason_match.group(1).strip() if reason_match else "LLM RAG Pipeline requested escalation"
        return True, f"AI Policy Triggered: {reason}"

    # 2. Check customer complaint_text ONLY for explicit escalation keywords
    complaint_lower = complaint_text.lower()
    triggers = [
        "escalate", "supervisor", "priority escalation",
        "human agent", "level 2", "senior technician",
        "unresolved after", "persist for more than",
        "repeated complaint", "critical issue", "emergency",
        "fraud", "identity theft",
    ]
    for phrase in triggers:
        if phrase in complaint_lower:
            idx = complaint_lower.find(phrase)
            start = max(0, idx - 60)
            end = min(len(complaint_text), idx + 100)
            excerpt = re.sub(r"\s+", " ", complaint_text[start:end].strip())
            return True, f"Customer Policy Triggered: ...{excerpt}..."

    return False, None


def generate_ticket_id() -> str:
    today = datetime.now().strftime("%Y%m%d")
    suffix = str(uuid.uuid4().int)[:6]
    return f"TCK-{today}-{suffix}"


# ---------------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "3.0.0",
        "resolver_solutions_count": resolver_solution_count()
    }


@app.post("/api/complaints")
@app.post("/query")
async def process_complaint(request: ComplaintRequest):
    """
    Primary Complaint Resolution Endpoint:
    1. Check technician-approved resolver base and send a match to Groq for formatting
    2. Fall back to 3-level RAG + Groq LLM synthesis
    3. Run escalation policy checks
    4. Register in Admin queue if escalated
    """
    complaint_text = request.complaint.strip()

    res = handle_new_complaint(complaint_text)
    if not res or not res.get("found"):
        raise HTTPException(status_code=404, detail="No matching knowledge found for this complaint.")

    complaint_id = res.get("complaint_id") or str(uuid.uuid4())
    solution = res.get("solution", "")
    category = res.get("category", "General")
    subcategory = res.get("subcategory", "General")
    source = res.get("source", "llm_kb")

    # Check for escalation triggers (comparing complaint text and solution logic accurately)
    escalation_required, escalation_reason = check_escalation(complaint_text, solution)

    ticket_id = generate_ticket_id()

    # Formulate standardized admin ticket structure if escalated
    ticket_data = {
        "id": ticket_id,
        "customer": request.email if request.email else (request.filingOnBehalf == "Yes" and "Representative Filing" or "Customer Submission"),
        "email": request.email or "",
        "accountId": f"#ACC-{str(uuid.uuid4().int)[:5]}",
        "tier": "Residential / Business",
        "location": f"{request.city or 'Unknown'} - {request.state or 'Sector'}",
        "category": category,
        "issueSummary": complaint_text[:60] + "..." if len(complaint_text) > 60 else complaint_text,
        "priority": "HIGH" if escalation_required else "MEDIUM",
        "riskScore": 92 if escalation_required else 65,
        "aging": "Just now",
        "status": "ESCALATED" if escalation_required else "RESOLVED",
        "assignedTo": "Sarah Connor (Agent #AGT-8824)",
        "complaintText": complaint_text,
        "sentiment": f"Source: {source}",
        "whyEscalated": [escalation_reason] if escalation_reason else ["Automated processing complete"],
        "aiSummary": f"Source: {source}. Category: {category}/{subcategory}",
        "aiRecommendation": solution,
        "ragSources": [f"{category} Knowledge Base"],
        "timeline": [
            {"time": datetime.now().strftime("%I:%M %p"), "event": f"Processed via {source}"}
        ],
        "notes": []
    }

    if escalation_required:
        ESCALATED_TICKETS.append(ticket_data)

    return {
        "success": True,
        "complaint_id": complaint_id,
        "ticketId": ticket_id,
        "found": True,
        "source": source,
        "category": category,
        "subcategory": subcategory,
        "solution": solution,
        "resolution": solution,
        "escalationRequired": escalation_required,
        "escalationReason": escalation_reason,
        "matches": res.get("matches", []),
        "status": ticket_data["status"],
    }


# ---------------------------------------------------------------------------
# Negative Feedback Pipeline
# ---------------------------------------------------------------------------
@app.post("/api/negative-feedback")
async def submit_negative_feedback(req: NegativeFeedbackRequest):
    """
    Customer reports the AI solution did not solve their problem.
    Stores the complaint + AI solution + user feedback for admin/technician review.
    """
    feedback_id = f"NFB-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4().int)[:6]}"

    item = {
        "feedback_id": feedback_id,
        "complaint_id": req.complaint_id,
        "category": req.category or "General",
        "subcategory": req.subcategory or "General",
        "complaint": req.complaint,
        "ai_solution": req.ai_solution,
        "feedback": req.feedback,
        "status": "pending",
        "submitted_at": datetime.now(timezone.utc).isoformat(),
    }

    # Persist to disk
    filepath = RESOLVER_PENDING / f"{feedback_id}.json"
    filepath.write_text(json.dumps(item, indent=2), encoding="utf-8")

    # Keep in memory
    NEGATIVE_FEEDBACK_ITEMS.append(item)

    return {"success": True, "feedback_id": feedback_id, "message": "Negative feedback recorded for technician review."}


@app.get("/api/admin/negative-feedback")
async def get_negative_feedback():
    """Return all pending negative feedback items for admin review."""
    pending = [item for item in NEGATIVE_FEEDBACK_ITEMS if item.get("status") == "pending"]
    return {"items": pending, "count": len(pending)}


@app.post("/api/admin/resolve-feedback")
async def resolve_feedback(req: ResolveFeedbackRequest):
    """
    Admin/technician submits the correct solution for a negative feedback item.
    Moves it from pending to resolved in resolver_base.
    """
    # Find the item
    item = None
    for i, fb in enumerate(NEGATIVE_FEEDBACK_ITEMS):
        if fb["feedback_id"] == req.feedback_id:
            item = fb
            break

    if not item:
        raise HTTPException(status_code=404, detail=f"Feedback item {req.feedback_id} not found.")

    # Update item
    item["status"] = "resolved"
    item["resolved_solution"] = req.resolved_solution
    item["resolved_at"] = datetime.now(timezone.utc).isoformat()

    # Move file from pending to resolved
    pending_file = RESOLVER_PENDING / f"{req.feedback_id}.json"
    resolved_file = RESOLVER_RESOLVED / f"{req.feedback_id}.json"

    resolved_file.write_text(json.dumps(item, indent=2), encoding="utf-8")

    resolver_markdown_file = store_resolver_solution(item, req.resolved_solution)

    if pending_file.exists():
        pending_file.unlink()

    return {
        "success": True,
        "feedback_id": req.feedback_id,
        "message": "Solution submitted and stored in resolver base.",
        "resolver_file": str(resolver_markdown_file.relative_to(_PROJECT_ROOT)),
    }


# ---------------------------------------------------------------------------
# Admin Escalation Tickets API
# ---------------------------------------------------------------------------
@app.get("/api/admin/tickets")
async def get_admin_tickets():
    """Return all real escalated tickets captured by the backend."""
    return {"tickets": ESCALATED_TICKETS}


# ---------------------------------------------------------------------------
# Mount Admin Portal Static Directory
# ---------------------------------------------------------------------------
admin_dir = Path(__file__).parent / "admin"
if admin_dir.exists():
    app.mount("/admin", StaticFiles(directory=str(admin_dir), html=True), name="admin")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
