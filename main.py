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
import threading
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, List, Dict, Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv
# Environment & Path Configuration
_ENV_FILE = Path(__file__).parent / ".env"
load_dotenv(_ENV_FILE, override=True)

_PROJECT_ROOT = Path(__file__).parent
if str(_PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(_PROJECT_ROOT))
# Import Model Server Logic & Pipelines
import model_server
from model_server import (
    handle_new_complaint,
)
from resolver_retriever import store_resolver_solution, resolver_solution_count
from email_service import send_resolution_email
from request_queue import ComplaintRequestQueue, classify_request
import database
from database import (
    init_db,
    db_save_complaint,
    db_save_escalated_ticket,
    db_get_escalated_tickets,
    db_resolve_escalated_ticket,
    db_save_negative_feedback,
    db_get_negative_feedback,
    db_resolve_negative_feedback,
    db_get_complaint_by_id,
)

# Initialize database schema (AWS RDS MySQL / SQLite) on backend launch
init_db()
# Global State (Synchronized with Database)
ESCALATED_TICKETS: List[Dict[str, Any]] = []
NEGATIVE_FEEDBACK_ITEMS: List[Dict[str, Any]] = []
RESOLUTION_LOCK = threading.Lock()


def _process_queued_complaint(job: Dict[str, Any]) -> None:
    """Run the resolver pipeline for one priority-selected complaint."""
    try:
        job["result"] = handle_new_complaint(
            job["complaint"],
            predicted_category=job.get("predicted_category"),
        )
    except Exception as exc:
        job["error"] = exc
    finally:
        job["done"].set()


COMPLAINT_QUEUE = ComplaintRequestQueue(_process_queued_complaint)

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
# FastAPI Application Setup
app = FastAPI(
    title="Telecom Complaint Intelligence & Resolution API",
    version="3.0.0",
    description="Hierarchical RAG + Cross-Encoder Reranker + Negative Feedback Pipeline API",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Pydantic Schemas
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


class SimpleQueryRequest(BaseModel):
    complaint: str


# Escalation Detection Helper
def check_escalation(
    complaint_text: str,
    solution_text: str,
    sources: Optional[List[Dict[str, Any]]] = None,
) -> tuple[bool, Optional[str]]:
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

    # 2. Apply source-backed escalation rules. The LLM must see these rules,
    # but the backend also enforces obvious conditions if the LLM says No.
    complaint_lower = complaint_text.lower()
    escalation_evidence = (
        r"\b(city[- ]wide|area[- ]wide|large geographic|network outage|"
        r"confirmed outage|outage cluster|multiple customers|multiple devices|"
        r"all devices|everyone)\b|"
        r"\b(unresolved|still|persists|continues|after (?:standard troubleshooting|"
        r"troubleshooting|restart|restarting)|completely unresponsive|"
        r"repeatedly crashes|physical damage|liquid exposure|network[- ]side|"
        r"requires (?:human|technician|engineering))\b"
    )
    if sources and re.search(escalation_evidence, complaint_lower):
        for source in sources:
            source_text = str(source.get("text", ""))
            if re.search(r"(?i)^##\s*(?:Escalation|Escalation Conditions|When Human Escalation Is Required)", source_text, re.MULTILINE):
                return True, "AI Policy Triggered: Retrieved source requires technician or support review for this condition."

    # 3. Check customer complaint_text for explicit escalation keywords
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
# API Routes
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

    priority_result = classify_request(complaint_text)
    queued_job = {
        "complaint": complaint_text,
        "predicted_category": None,
        "queue": priority_result["queue"],
        "done": threading.Event(),
    }
    COMPLAINT_QUEUE.submit(queued_job)
    if not queued_job["done"].wait(timeout=float(os.getenv("QUEUE_REQUEST_TIMEOUT", "300"))):
        raise HTTPException(status_code=504, detail="Complaint is still queued. Please retry shortly.")
    if queued_job.get("error"):
        raise HTTPException(status_code=500, detail="Complaint processing failed.")
    res = queued_job.get("result")
    if not res:
        from llm_reasoning import fallback_generate_solution
        res = {
            "complaint_id": str(uuid.uuid4()),
            "found": False,
            "source": "escalation",
            "category": "General",
            "subcategory": "General",
            "matches": [],
            "solution": fallback_generate_solution(complaint_text, []),
        }

    is_found = bool(res.get("found", True))
    complaint_id = res.get("complaint_id") or str(uuid.uuid4())
    solution = res.get("solution", "")
    category = res.get("category")
    if not category or category == "General":
        from retriever import classify_category, normalize_category
        ranked = classify_category(complaint_text)
        category = normalize_category(ranked[0][0]) if ranked else "Broadband / Internet"
    subcategory = res.get("subcategory", "General")
    source = res.get("source", "llm_kb")

    if not is_found or not solution:
        from llm_reasoning import fallback_generate_solution
        solution = solution or fallback_generate_solution(complaint_text, [])
        escalation_required = True
        escalation_reason = "No matching knowledge base documentation found for this complaint - automatically escalated to support technician."
    else:
        # Check both the LLM decision and the retrieved source-backed policy.
        escalation_required, escalation_reason = check_escalation(
            complaint_text,
            solution,
            res.get("matches", []),
        )

    ticket_id = generate_ticket_id()

    # Formulate standardized admin ticket structure if escalated
    ticket_data = {
        "id": ticket_id,
        "customer": request.filingOnBehalf == "Yes" and "Representative Filing" or "Customer Submission",
        "accountId": f"#ACC-{str(uuid.uuid4().int)[:5]}",
        "tier": "Residential / Business",
        "location": f"{request.city or 'Unknown'} - {request.state or 'Sector'}",
        "customerEmail": request.email.strip(),
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
        db_save_escalated_ticket(ticket_data)

    # Persist processed complaint to database
    db_save_complaint(
        complaint_id=complaint_id,
        ticket_id=ticket_id,
        complaint=complaint_text,
        email=request.email.strip(),
        city=request.city or "",
        state=request.state or "",
        zip_code=request.zipCode or "",
        category=category,
        subcategory=subcategory,
        confidence=res.get("confidence", 0.94),
        ai_solution=solution,
        status=ticket_data["status"],
    )

    return {
        "success": True,
        "complaint_id": complaint_id,
        "ticketId": ticket_id,
        "found": is_found,
        "source": source,
        "category": category,
        "subcategory": subcategory,
        "solution": solution,
        "resolution": solution,
        "escalationRequired": escalation_required,
        "escalationReason": escalation_reason,
        "customerMessage": (
            "Your request has been forwarded to our technician. "
            "The technician will contact you soon. Thank you for your patience."
            if escalation_required else None
        ),
        "matches": res.get("matches", []),
        "status": ticket_data["status"],
        "priority": priority_result.get("priority"),
        "urgency": priority_result.get("urgency"),
    }


# Negative Feedback Pipeline
@app.post("/api/negative-feedback")
async def submit_negative_feedback(req: NegativeFeedbackRequest):
    """
    Customer reports the AI solution did not solve their problem.
    Stores the complaint + AI solution + user feedback for admin/technician review in DB and disk.
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

    # Persist to database (AWS RDS MySQL / SQLite)
    db_save_negative_feedback(item)

    # Persist to disk fallback
    filepath = RESOLVER_PENDING / f"{feedback_id}.json"
    filepath.write_text(json.dumps(item, indent=2), encoding="utf-8")

    NEGATIVE_FEEDBACK_ITEMS.append(item)

    return {"success": True, "feedback_id": feedback_id, "message": "Negative feedback recorded for technician review."}


@app.get("/api/admin/negative-feedback")
async def get_negative_feedback():
    """Return all pending negative feedback items from the database."""
    db_pending = db_get_negative_feedback(status="pending")
    return {"items": db_pending or [], "count": len(db_pending or [])}


@app.post("/api/admin/resolve-feedback")
def resolve_feedback(req: ResolveFeedbackRequest):
    """
    Admin/technician submits the correct solution for a negative feedback item.
    Moves it from pending to resolved in database and resolver_base.
    """
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
            # Try fetching from database
            db_records = db_get_negative_feedback()
            item = next((fb for fb in db_records if fb["feedback_id"] == req.feedback_id), None)
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

        # Update database record
        db_resolve_negative_feedback(
            feedback_id=req.feedback_id,
            resolved_solution=req.resolved_solution,
            email_status=email_status,
            email_error=email_error,
        )
        db_resolve_escalated_ticket(
            ticket_id=req.feedback_id,
            support_message=req.resolved_solution,
            email_status=email_status,
            email_error=email_error,
        )

        # Save to disk file fallback
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
# Admin Escalation Tickets API
@app.get("/api/admin/tickets")
async def get_admin_tickets():
    """Return all real escalated tickets from the database."""
    db_tickets = db_get_escalated_tickets()
    return {"tickets": db_tickets or []}


@app.post("/api/admin/resolve-ticket")
def resolve_escalated_ticket(req: ResolveTicketRequest):
    """Save a technician response for an escalated ticket and email the customer."""
    with RESOLUTION_LOCK:
        ticket = next((item for item in ESCALATED_TICKETS if item["id"] == req.ticket_id), None)
        if not ticket:
            db_tickets = db_get_escalated_tickets()
            ticket = next((item for item in db_tickets if item["id"] == req.ticket_id), None)
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

        # Update database record
        db_resolve_escalated_ticket(
            ticket_id=ticket["id"],
            support_message=resolved_solution,
            email_status=email_status,
            email_error=email_error,
        )

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
# Admin Flush / Reset API
@app.post("/api/admin/flush-tickets")
def flush_admin_tickets():
    """Wipe all tickets and negative feedback from memory and database."""
    global ESCALATED_TICKETS, NEGATIVE_FEEDBACK
    with RESOLUTION_LOCK:
        ESCALATED_TICKETS.clear()
        NEGATIVE_FEEDBACK.clear()
        try:
            from clean_database_and_resolver import clean_database
            clean_database()
        except Exception as err:
            print("Flush error:", err)
    return {"success": True, "message": "All complaints, escalated tickets, and negative feedback flushed."}


# Customer Complaint Lookup (for Track My Ticket page)
@app.get("/api/complaints/{complaint_id}")
async def get_complaint_by_id(complaint_id: str):
    """
    Look up a complaint by its complaint_id (UUID).
    Returns complaint details, category, AI solution and status.
    """
    record = db_get_complaint_by_id(complaint_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Complaint {complaint_id} not found.")
    return record

# Mount Admin Portal Static Directory
admin_dir = Path(__file__).parent / "admin"
if admin_dir.exists():
    app.mount("/admin", StaticFiles(directory=str(admin_dir), html=True), name="admin")

# Mount User Frontend Static Directory (Next.js export out/)
frontend_out_dir = Path(__file__).parent / "frontend" / "out"
if frontend_out_dir.exists():
    app.mount("/", StaticFiles(directory=str(frontend_out_dir), html=True), name="frontend")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", "8000")))
