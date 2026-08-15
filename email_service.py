"""Email notifications for technician-approved complaint resolutions."""

import os
import smtplib
from email.message import EmailMessage


SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "telecomcomplaincx@gmail.com")
SMTP_FROM = os.getenv("SMTP_FROM", SMTP_USERNAME)


def send_resolution_email(
    recipient: str,
    complaint: str,
    user_feedback: str,
    technician_solution: str,
    feedback_id: str,
) -> None:
    """Send the technician's approved solution to the customer.

    SMTP_PASSWORD is deliberately read from the environment and is never
    included in the complaint or feedback records.
    """
    recipient = (recipient or "").strip()
    smtp_password = os.getenv("SMTP_PASSWORD", "").strip()
    if not recipient:
        raise ValueError("Customer email address is missing.")
    if not smtp_password:
        raise RuntimeError("SMTP_PASSWORD is not configured.")

    message = EmailMessage()
    message["From"] = SMTP_FROM
    message["To"] = recipient
    message["Subject"] = "Update regarding your telecom complaint"
    message.set_content(
        "Sorry for the incorrect response. Your complaint has been forwarded "
        "to our technician.\n\n"
        f"Complaint:\n{complaint}\n\n"
        f"Your feedback:\n{user_feedback}\n\n"
        "Technician's solution:\n"
        f"{technician_solution}\n\n"
        "Thank you for your patience.\n\n"
        f"Feedback reference: {feedback_id}"
    )

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USERNAME, smtp_password)
        smtp.send_message(message)
