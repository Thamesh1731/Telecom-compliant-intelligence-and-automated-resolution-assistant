"""
main.py — Combined FastAPI Backend for Telecom RAG + LLM Resolution Engine with Admin Portal.

Features:
1. Technician resolver-base lookup followed by LLM formatting.
2. 3-level Hierarchical RAG Retrieval + Groq LLM Reasoning fallback.
3. Negative Feedback Pipeline (routes customer-reported failures to Admin for manual resolution).
4. Admin Portal Static File Mount (/admin) & Real-Time Escalations API (/api/admin/tickets).
5. Resolver Base storage for technician-provided solutions.
"""

import sys
import uuid
import re
import json
import threading
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
from model_server import handle_new_complaint
from email_service import send_resolution_email
from resolver_retriever import store_resolver_solution, resolver_solution_count
from request_queue import ComplaintRequestQueue, classify_request

# ---------------------------------------------------------------------------
# Global State
# ---------------------------------------------------------------------------
ESCALATED_TICKETS: List[Dict[str, Any]] = []
NEGATIVE_FEEDBACK_ITEMS: List[Dict[str, Any]] = []
COMPLAINT_REQUESTS: Dict[str, Dict[str, Any]] = {}
RESOLUTION_LOCK = threading.Lock()
ESCALATION_FORWARD_MESSAGE = (
    "Your response has been forwarded to our technician. "
    "They will contact you soon."
)

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
    email: Optional[str] = ""
    city: Optional[str] = ""
    state: Optional[str] = ""
    zipCode: Optional[str] = ""
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
    email: Optional[str] = ""


class ResolveFeedbackRequest(BaseModel):
    feedback_id: str
    resolved_solution: str


class ResolveTicketRequest(BaseModel):
    ticket_id: str
    resolved_solution: str


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


def _process_queued_complaint(job: Dict[str, Any]) -> None:
    """Run one queued complaint through resolver/RAG/LLM and save its result."""
    complaint_id = job["complaint_id"]
    complaint_text = job["complaint"]
    request_data = job["request"]
    COMPLAINT_REQUESTS[complaint_id]["status"] = "PROCESSING"

    try:
        res = handle_new_complaint(complaint_text)
        if not res or not res.get("found"):
            raise RuntimeError("No matching knowledge found for this complaint.")

        solution = res.get("solution", "")
        category = res.get("category", "General")
        subcategory = res.get("subcategory", "General")
        source = res.get("source", "llm_kb")
        escalation_required, escalation_reason = check_escalation(complaint_text, solution)
        ticket_id = job["ticket_id"]

        ticket_data = {
            "id": ticket_id,
            "customer": request_data.get("filingOnBehalf") == "Yes" and "Representative Filing" or "Customer Submission",
            "accountId": f"#ACC-{str(uuid.uuid4().int)[:5]}",
            "tier": "Residential / Business",
            "location": f"{request_data.get('city') or 'Unknown'} - {request_data.get('state') or 'Sector'}",
            "category": category,
            "issueSummary": complaint_text[:60] + "..." if len(complaint_text) > 60 else complaint_text,
            "priority": "HIGH" if escalation_required else "MEDIUM",
            "riskScore": 92 if escalation_required else 65,
            "aging": "Just now",
            "status": "ESCALATED" if escalation_required else "RESOLVED",
            "assignedTo": "Sarah Connor (Agent #AGT-8824)",
            "complaintText": complaint_text,
            "customerEmail": request_data.get("email", ""),
            "sentiment": f"Source: {source}",
            "whyEscalated": [escalation_reason] if escalation_reason else ["Automated processing complete"],
            "aiSummary": f"Source: {source}. Category: {category}/{subcategory}",
            "aiRecommendation": solution,
            "ragSources": [f"{category} Knowledge Base"],
            "timeline": [{"time": datetime.now().strftime("%I:%M %p"), "event": f"Processed via {source}"}],
            "notes": [],
        }
        if escalation_required:
            ESCALATED_TICKETS.append(ticket_data)

        customer_solution = ESCALATION_FORWARD_MESSAGE if escalation_required else solution

        COMPLAINT_REQUESTS[complaint_id].update({
            "success": True,
            "found": True,
            "source": source,
            "category": category,
            "subcategory": subcategory,
            "solution": customer_solution,
            "resolution": customer_solution,
            "aiSolution": solution,
            "escalationRequired": escalation_required,
            "escalationReason": escalation_reason,
            "matches": res.get("matches", []),
            "status": ticket_data["status"],
        })
    except Exception as exc:
        COMPLAINT_REQUESTS[complaint_id].update({
            "success": False,
            "status": "FAILED",
            "error": str(exc),
        })


complaint_queue = ComplaintRequestQueue(_process_queued_complaint)


# ---------------------------------------------------------------------------
# API Routes
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {
        "status": "ok",
        "version": "3.0.0",
        "resolver_solutions_count": resolver_solution_count(),
        "request_queue": complaint_queue.snapshot(),
    }


@app.get("/api/admin/queue-status")
async def get_queue_status():
    return complaint_queue.snapshot()


@app.post("/api/complaints", status_code=202)
@app.post("/query", status_code=202)
async def process_complaint(request: ComplaintRequest):
    """
    Primary Complaint Resolution Endpoint:
    1. Classify urgency and priority.
    2. Enqueue the complaint.
    3. Return a request ID for status polling.
    """
    complaint_text = request.complaint.strip()
    try:
        priority_result = classify_request(complaint_text)
    except Exception as exc:
        raise HTTPException(status_code=503, detail=f"Priority classifier unavailable: {exc}") from exc

    complaint_id = str(uuid.uuid4())
    ticket_id = generate_ticket_id()
    job = {
        "complaint_id": complaint_id,
        "ticket_id": ticket_id,
        "complaint": complaint_text,
        "request": request.model_dump(),
        "priority_result": priority_result,
        "priority": priority_result["priority"],
        "queue": priority_result["queue"],
        "status": "QUEUED",
    }
    COMPLAINT_REQUESTS[complaint_id] = {
        "success": True,
        "complaint_id": complaint_id,
        "ticketId": ticket_id,
        "status": "QUEUED",
        "urgency": priority_result["urgency"],
        "priority": priority_result["priority"],
        "queue": priority_result["queue"],
        "priorityScore": priority_result.get("priority_score"),
    }
    queue_info = complaint_queue.submit(job)
    COMPLAINT_REQUESTS[complaint_id].update(queue_info)
    return COMPLAINT_REQUESTS[complaint_id]


@app.get("/api/complaints/{complaint_id}")
async def get_complaint_status(complaint_id: str):
    result = COMPLAINT_REQUESTS.get(complaint_id)
    if not result:
        raise HTTPException(status_code=404, detail="Complaint request not found.")
    return result


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
        "email": req.email.strip(),
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
def resolve_feedback(req: ResolveFeedbackRequest):
    """
    Admin/technician submits the correct solution for a negative feedback item.
    Moves it from pending to resolved in resolver_base.
    """
    # Serialize resolution and email delivery so repeated clicks cannot create
    # duplicate resolver files or send duplicate emails.
    with RESOLUTION_LOCK:
        item = next(
            (fb for fb in NEGATIVE_FEEDBACK_ITEMS if fb["feedback_id"] == req.feedback_id),
            None,
        )
        resolved_file = RESOLVER_RESOLVED / f"{req.feedback_id}.json"
        if item and item.get("status") == "resolved":
            raise HTTPException(status_code=409, detail="This feedback has already been resolved.")
        if resolved_file.exists():
            raise HTTPException(status_code=409, detail="This feedback has already been resolved.")
        if not item:
            raise HTTPException(status_code=404, detail=f"Feedback item {req.feedback_id} not found.")

        item["status"] = "resolved"
        item["resolved_solution"] = req.resolved_solution
        item["resolved_at"] = datetime.now(timezone.utc).isoformat()

        pending_file = RESOLVER_PENDING / f"{req.feedback_id}.json"
        resolver_markdown_file = store_resolver_solution(item, req.resolved_solution)

        email_status = "sent"
        email_error = None
        try:
            send_resolution_email(
                recipient=item.get("email", ""),
                complaint=item["complaint"],
                user_feedback=item["feedback"],
                technician_solution=req.resolved_solution,
                feedback_id=req.feedback_id,
            )
        except Exception as exc:
            email_status = "failed"
            email_error = str(exc)

        item["email_status"] = email_status
        item["email_sent_at"] = datetime.now(timezone.utc).isoformat() if email_status == "sent" else None
        if email_error:
            item["email_error"] = email_error

        # Save the final resolution record, including email delivery status.
        resolved_file.write_text(json.dumps(item, indent=2), encoding="utf-8")

        if pending_file.exists():
            pending_file.unlink()

    return {
        "success": True,
        "feedback_id": req.feedback_id,
        "message": (
            "Solution submitted, stored in resolver base, and emailed to the customer."
            if email_status == "sent"
            else "Solution submitted and stored in resolver base, but customer email delivery failed."
        ),
        "resolver_file": str(resolver_markdown_file.relative_to(_PROJECT_ROOT)),
        "email_status": email_status,
        "email_error": email_error,
    }


# ---------------------------------------------------------------------------
# Admin Escalation Tickets API
# ---------------------------------------------------------------------------
@app.get("/api/admin/tickets")
async def get_admin_tickets():
    """Return all real escalated tickets captured by the backend."""
    return {"tickets": ESCALATED_TICKETS}


@app.post("/api/admin/resolve-ticket")
def resolve_escalated_ticket(req: ResolveTicketRequest):
    """Save a technician response for an escalated ticket and email the customer."""
    with RESOLUTION_LOCK:
        ticket = next((item for item in ESCALATED_TICKETS if item["id"] == req.ticket_id), None)
        if not ticket:
            raise HTTPException(status_code=404, detail=f"Escalated ticket {req.ticket_id} not found.")
        if ticket.get("status") == "RESOLVED":
            raise HTTPException(status_code=409, detail="This escalated ticket has already been resolved.")

        resolved_solution = req.resolved_solution.strip()
        if not resolved_solution:
            raise HTTPException(status_code=400, detail="Resolved solution cannot be empty.")

        ticket["status"] = "RESOLVED"
        ticket["supportMessage"] = resolved_solution
        ticket["resolvedAt"] = datetime.now(timezone.utc).isoformat()
        email_status = "sent"
        email_error = None
        try:
            send_resolution_email(
                recipient=ticket.get("customerEmail", ""),
                complaint=ticket["complaintText"],
                user_feedback=ticket.get("whyEscalated", ["Escalation requested"])[0],
                technician_solution=resolved_solution,
                feedback_id=ticket["id"],
            )
        except Exception as exc:
            email_status = "failed"
            email_error = str(exc)

        ticket["emailStatus"] = email_status
        if email_error:
            ticket["emailError"] = email_error
        ticket.setdefault("timeline", []).append({
            "time": datetime.now().strftime("%I:%M %p"),
            "event": "Technician resolved the escalation and customer notification was "
            + ("sent." if email_status == "sent" else "not delivered."),
        })

        return {
            "success": True,
            "ticket_id": ticket["id"],
            "email_status": email_status,
            "email_error": email_error,
            "message": (
                "Support message saved and emailed to the customer."
                if email_status == "sent"
                else "Support message saved, but customer email delivery failed."
            ),
        }


# ---------------------------------------------------------------------------
# Mount Admin Portal Static Directory
# ---------------------------------------------------------------------------
admin_dir = Path(__file__).parent / "admin"
if admin_dir.exists():
    app.mount("/admin", StaticFiles(directory=str(admin_dir), html=True), name="admin")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
