"""
database.py — Relational Database Layer for SignalCX.
Supports AWS RDS MySQL with automatic SQLite fallback for local development.
"""

import os
import json
from datetime import datetime, timezone
from contextlib import contextmanager
from typing import List, Dict, Any, Optional

from sqlalchemy import (
    create_engine,
    Column,
    String,
    Text,
    Float,
    DateTime,
    Integer,
    select,
    desc,
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session
# Database URL & Engine Configuration
# Example AWS RDS MySQL URL: mysql+pymysql://admin:password@telecom-mysql-db.c123456.us-east-1.rds.amazonaws.com:3306/telecom_cx
DATABASE_URL = os.getenv("DATABASE_URL", "").strip()

if not DATABASE_URL:
    # Fallback to local SQLite if no cloud database URL is configured
    DATABASE_URL = "sqlite:///./telecom_data.db"

# SQLite requires check_same_thread=False for async/threaded FastAPI calls
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
    engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
else:
    # MySQL / Cloud RDS configuration with connection pool management
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=3600,
        pool_size=10,
        max_overflow=20,
        echo=False,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
# Database Table Models
class ComplaintRecord(Base):
    """Logs all customer complaint intakes, category predictions, and AI resolutions."""
    __tablename__ = "complaints"

    complaint_id = Column(String(64), primary_key=True, index=True)
    customer_email = Column(String(255), nullable=True, index=True)
    complaint_text = Column(Text, nullable=False)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    zip_code = Column(String(20), nullable=True)
    category = Column(String(100), nullable=True, index=True)
    subcategory = Column(String(100), nullable=True)
    confidence = Column(Float, nullable=True)
    ai_solution = Column(Text, nullable=True)
    status = Column(String(50), default="RESOLVED", index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class EscalatedTicketRecord(Base):
    """Stores all real-time tickets routed to Human Level-3 Network Operations."""
    __tablename__ = "escalated_tickets"

    ticket_id = Column(String(64), primary_key=True, index=True)
    complaint_id = Column(String(64), nullable=True, index=True)
    customer_email = Column(String(255), nullable=True)
    complaint_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)
    confidence = Column(Float, nullable=True)
    priority = Column(String(20), default="HIGH", index=True)
    status = Column(String(50), default="OPEN", index=True)
    why_escalated = Column(Text, nullable=True)  # JSON string of triggers
    ai_solution = Column(Text, nullable=True)
    support_message = Column(Text, nullable=True)
    email_status = Column(String(50), nullable=True)
    email_error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    def to_dict(self) -> Dict[str, Any]:
        why_list = []
        if self.why_escalated:
            try:
                why_list = json.loads(self.why_escalated)
            except Exception:
                why_list = [self.why_escalated]

        cat = self.category
        if not cat or cat == "General":
            try:
                from retriever import classify_category, normalize_category
                ranked = classify_category(self.complaint_text)
                cat = normalize_category(ranked[0][0])
            except Exception:
                cat = "Broadband / Internet"

        return {
            "id": self.ticket_id,
            "complaintId": self.complaint_id,
            "customerEmail": self.customer_email or "",
            "customer": self.customer_email or "Customer Submission",
            "complaintText": self.complaint_text,
            "category": cat,
            "predictedCategory": cat,
            "subcategory": self.subcategory or "General",
            "confidence": self.confidence,
            "priority": self.priority or "HIGH",
            "status": self.status or "OPEN",
            "whyEscalated": why_list,
            "aiRecommendation": self.ai_solution or "",
            "supportMessage": self.support_message,
            "emailStatus": self.email_status,
            "emailError": self.email_error,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "resolvedAt": self.resolved_at.isoformat() if self.resolved_at else None,
        }


class NegativeFeedbackRecord(Base):
    """Tracks negative customer feedback when the automated resolution was insufficient."""
    __tablename__ = "negative_feedback"

    feedback_id = Column(String(64), primary_key=True, index=True)
    complaint_id = Column(String(64), nullable=True, index=True)
    customer_email = Column(String(255), nullable=True)
    complaint_text = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)
    ai_solution = Column(Text, nullable=True)
    feedback_text = Column(Text, nullable=False)
    status = Column(String(50), default="pending", index=True)  # pending | resolved
    resolved_solution = Column(Text, nullable=True)
    email_status = Column(String(50), nullable=True)
    email_error = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    resolved_at = Column(DateTime, nullable=True)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "feedback_id": self.feedback_id,
            "complaint_id": self.complaint_id,
            "email": self.customer_email or "",
            "complaint": self.complaint_text,
            "category": self.category or "General",
            "subcategory": self.subcategory or "General",
            "ai_solution": self.ai_solution or "",
            "feedback": self.feedback_text,
            "status": self.status,
            "resolved_solution": self.resolved_solution,
            "email_status": self.email_status,
            "email_error": self.email_error,
            "submitted_at": self.submitted_at.isoformat() if self.submitted_at else None,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
        }


class ResolverSolutionRecord(Base):
    """Permanent audit log of verified technician solutions stored in the dynamic Resolver Base."""
    __tablename__ = "technician_resolutions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    feedback_id = Column(String(64), nullable=True, index=True)
    complaint_text = Column(Text, nullable=False)
    customer_feedback = Column(Text, nullable=True)
    technician_solution = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)
    subcategory = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
# Database Initialization & Session Helpers
def init_db():
    """Create all tables in the database if they do not exist."""
    Base.metadata.create_all(bind=engine)
    db_target = DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL
    print(f"[Database] Schema initialized on: {db_target}")


@contextmanager
def get_db_session():
    """Context manager for safe session allocation and error rollback."""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
# CRUD Database Operations
def db_save_complaint(
    complaint_id: str,
    complaint: str,
    email: str = "",
    city: str = "",
    state: str = "",
    zip_code: str = "",
    category: str = "General",
    subcategory: str = "General",
    confidence: float = 0.9,
    ai_solution: str = "",
    status: str = "RESOLVED",
) -> None:
    """Save a processed customer complaint record."""
    with get_db_session() as db:
        record = ComplaintRecord(
            complaint_id=complaint_id,
            customer_email=email,
            complaint_text=complaint,
            city=city,
            state=state,
            zip_code=zip_code,
            category=category,
            subcategory=subcategory,
            confidence=confidence,
            ai_solution=ai_solution,
            status=status,
        )
        db.merge(record)


def db_save_escalated_ticket(ticket_data: Dict[str, Any]) -> None:
    """Save or update an escalated ticket in the database."""
    with get_db_session() as db:
        why_str = json.dumps(ticket_data.get("whyEscalated", []))
        record = EscalatedTicketRecord(
            ticket_id=ticket_data["id"],
            complaint_id=ticket_data.get("complaintId"),
            customer_email=ticket_data.get("customerEmail", ""),
            complaint_text=ticket_data["complaintText"],
            category=ticket_data.get("category") or ticket_data.get("predictedCategory") or "Internet / Broadband",
            subcategory=ticket_data.get("subcategory", "General"),
            confidence=ticket_data.get("confidence", 0.9),
            priority=ticket_data.get("priority", "HIGH"),
            status=ticket_data.get("status", "OPEN"),
            why_escalated=why_str,
            ai_solution=ticket_data.get("aiRecommendation", ""),
            support_message=ticket_data.get("supportMessage"),
            email_status=ticket_data.get("emailStatus"),
            email_error=ticket_data.get("emailError"),
        )
        db.merge(record)


def db_get_escalated_tickets() -> List[Dict[str, Any]]:
    """Retrieve all escalated tickets ordered by creation date descending."""
    with get_db_session() as db:
        stmt = select(EscalatedTicketRecord).order_by(desc(EscalatedTicketRecord.created_at))
        records = db.scalars(stmt).all()
        return [r.to_dict() for r in records]


def db_resolve_escalated_ticket(
    ticket_id: str,
    support_message: str,
    email_status: str,
    email_error: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Resolve an escalated ticket and record technician support response."""
    with get_db_session() as db:
        record = db.get(EscalatedTicketRecord, ticket_id)
        if not record:
            return None
        record.status = "RESOLVED"
        record.support_message = support_message
        record.email_status = email_status
        record.email_error = email_error
        record.resolved_at = datetime.now(timezone.utc)
        return record.to_dict()


def db_save_negative_feedback(item: Dict[str, Any]) -> None:
    """Save customer-reported negative feedback to the database."""
    with get_db_session() as db:
        record = NegativeFeedbackRecord(
            feedback_id=item["feedback_id"],
            complaint_id=item.get("complaint_id"),
            customer_email=item.get("email", ""),
            complaint_text=item["complaint"],
            category=item.get("category", "General"),
            subcategory=item.get("subcategory", "General"),
            ai_solution=item.get("ai_solution", ""),
            feedback_text=item["feedback"],
            status=item.get("status", "pending"),
        )
        db.merge(record)


def db_get_negative_feedback(status: Optional[str] = None) -> List[Dict[str, Any]]:
    """Retrieve negative feedback items, optionally filtered by status."""
    with get_db_session() as db:
        stmt = select(NegativeFeedbackRecord).order_by(desc(NegativeFeedbackRecord.submitted_at))
        if status:
            stmt = stmt.where(NegativeFeedbackRecord.status == status)
        records = db.scalars(stmt).all()
        return [r.to_dict() for r in records]


def db_resolve_negative_feedback(
    feedback_id: str,
    resolved_solution: str,
    email_status: str,
    email_error: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Mark negative feedback as resolved by a technician and record solution."""
    with get_db_session() as db:
        record = db.get(NegativeFeedbackRecord, feedback_id)
        if not record:
            return None
        record.status = "resolved"
        record.resolved_solution = resolved_solution
        record.email_status = email_status
        record.email_error = email_error
        record.resolved_at = datetime.now(timezone.utc)

        # Log into permanent technician resolutions table
        res_log = ResolverSolutionRecord(
            feedback_id=feedback_id,
            complaint_text=record.complaint_text,
            customer_feedback=record.feedback_text,
            technician_solution=resolved_solution,
            category=record.category,
            subcategory=record.subcategory,
        )
        db.add(res_log)
        return record.to_dict()
