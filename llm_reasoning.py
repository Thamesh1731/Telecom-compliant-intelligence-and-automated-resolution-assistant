import os
import re
from groq import Groq

GROQ_MODEL = os.environ.get("GROQ_MODEL", "openai/gpt-oss-20b")

SYSTEM_PROMPT = """
You are Signal CX, an automated Telecom Diagnostic & Resolution Assistant.

Your task is to analyze the customer's complaint and the retrieved resolution sources,
and generate a clear, empathetic, and actionable support response addressed DIRECTLY TO THE CUSTOMER.

TARGET AUDIENCE & TONE
- The recipient of your output is the END CUSTOMER (NOT a technician or support agent).
- Write all Recommended Solution steps in direct second-person language ("you", "your", "please", "ensure").
- Do NOT output internal agent instructions like "Verify customer identity", "The support agent should", or "Explain the process to the customer". Instead, convert them into customer-facing action steps (for example: "Log in to your account and verify your identity", "Select the active subscription you wish to terminate", "Review and confirm your cancellation request", "Restart your router by unplugging it for 30 seconds").

SOURCE TRUTH & PRIORITY
1. Technician-approved resolver-base solutions are authoritative.
2. Verified knowledge-base resolution & troubleshooting procedures are secondary.
3. Base your recommendations strictly on the retrieved source guidance. Never invent technical causes, external phone numbers, or unverified policies.
4. If the retrieved source indicates an issue cannot be self-resolved by the customer or requires technician intervention, set Escalation: Yes.

CONTENT RULES
- Problem: One clear, concise sentence describing the customer's issue from their perspective.
- Recommended Solution: Up to 5 numbered, customer-facing action steps with clear, practical guidance for the customer.
- Reason: One or two concise sentences explaining how this procedure resolves their issue.
- Escalation: Yes or No.
- Escalation Reason: Brief explanation, or "Not required".
- Never present symptom lists, internal document names, metadata, IDs, or database schemas as steps.
- Never ask the customer for passwords, PINs, OTPs, or credit card CVVs.

OUTPUT FORMAT
Return ONLY the following structure:

Problem:
<one clear sentence describing the customer's issue>

Recommended Solution:
1. <first customer-facing action step>
2. <second customer-facing action step>
3. <third customer-facing action step>
4. <additional customer-facing step if needed>
5. <additional customer-facing step if needed>

Reason:
<one or two concise sentences explaining why this solution resolves the issue>

Escalation:
<Yes or No>

Escalation Reason:
<brief reason, or Not required>
"""

import httpx

_client = None


def _get_client():
    """Lazily create the Groq client so importing this module doesn't
    require the API key to already be set (useful for testing other
    parts of the pipeline without hitting the LLM)."""
    global _client
    if _client is None:
        api_key = os.environ.get("GROQ_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GROQ_API_KEY environment variable is not set. "
                "Get a key from https://console.groq.com and set it, e.g.:\n"
                "  export GROQ_API_KEY=your_key_here   (Linux/Mac)\n"
                "  setx GROQ_API_KEY your_key_here      (Windows)"
            )
        _client = Groq(api_key=api_key, http_client=httpx.Client())
    return _client


def build_rag_context(results, max_sources=2):
    """Turn resolver-base or knowledge-base results into concise LLM context."""
    context = []
    for i, result in enumerate(results[:max_sources], start=1):
        metadata = result.get("metadata", {})
        source = metadata.get("source", result.get("source", "knowledge_base"))
        source_text = result.get("text", "") or ""
        source_label = (
            "Technician-approved solution. Preserve its meaning and instructions."
            if source == "resolver_base"
            else "Verified troubleshooting and resolution guidance."
        )
        context.append(
            f"""
--- Resolution Source {i} ---

Document ID: {metadata.get("document_id", "Unknown")}
Source: {source}
Category: {metadata.get("category", "Unknown")}
Subcategory: {metadata.get("subcategory", "Unknown")}
Section: {metadata.get("section_name", "Unknown")}
Source role: {source_label}

Source Content:
{extract_solution_source(result)}
            """
        )
    return "\n".join(context)


def _markdown_section(text, heading):
    """Return the body of one exact level-two Markdown section."""
    pattern = rf"(?ims)^##\s+{re.escape(heading)}\s*$\n(.*?)(?=^##\s+|\Z)"
    match = re.search(pattern, text or "")
    return match.group(1).strip() if match else ""


def _clean_solution_text(text):
    """Remove document wrappers and internal metadata from solution content."""
    cleaned = []
    for line in (text or "").splitlines():
        value = line.strip()
        if not value or value.startswith("#"):
            continue
        if re.match(r"^-\s*(Feedback ID|Complaint ID|Category|Subcategory|Resolved At):", value, re.I):
            continue
        if re.match(r"^(Feedback ID|Complaint ID|Category|Subcategory|Resolved At):", value, re.I):
            continue
        cleaned.append(value)
    return "\n".join(cleaned).strip()


def extract_solution_source(result):
    """Extract only actionable content; never expose symptoms or metadata to the LLM."""
    text = result.get("text", "") or ""
    metadata = result.get("metadata", {})
    source = metadata.get("source", result.get("source", "knowledge_base"))

    if source == "resolver_base":
        approved = _markdown_section(text, "Correct Solution")
        if not approved:
            approved_match = re.search(r"(?is)Approved Solution:\s*(.*)", text)
            approved = approved_match.group(1).strip() if approved_match else text
        return _clean_solution_text(approved)

    sections = []
    for heading in (
        "Troubleshooting Procedure",
        "Basic Troubleshooting",
        "Resolution",
        "Recommended Human Action",
        "Human Action",
        "Escalation Conditions",
        "Escalation",
        "When Human Escalation Is Required",
    ):
        section = _markdown_section(text, heading)
        if section:
            sections.append(f"{heading}:\n{_clean_solution_text(section)}")
    return "\n\n".join(sections) or _clean_solution_text(text)


def _response_is_usable(response):
    """Reject malformed or leaked source documents returned by the LLM."""
    if not response or not re.search(r"Recommended Solution\s*:", response, re.I):
        return False
    leaked = ("Common Symptoms", "Possible Causes", "Feedback ID:", "Complaint ID:", "## Metadata")
    return not any(marker.lower() in response.lower() for marker in leaked)


def _extract_procedure_steps(text):
    """Extract parent troubleshooting actions without flattening nested bullets."""
    sections = []
    for heading in (
        "Troubleshooting Procedure",
        "Basic Troubleshooting",
        "Recommended Human Action",
        "Human Action",
    ):
        section = _markdown_section(text, heading)
        if section:
            sections.append(section)

    procedure = "\n\n".join(sections)
    if not procedure:
        return []

    # Wi-Fi and similar articles use ### 1., ### 2. parent actions followed
    # by nested bullets. Keep the parent action plus a short detail; never
    # flatten nested cause/location bullets into separate steps.
    chunks = re.split(r"(?m)(?=^###\s+)", procedure)
    parent_steps = []
    for chunk in chunks:
        heading_match = re.match(
            r"(?m)^###\s+(?:\d+[.)]\s*)?(.+?)\s*$",
            chunk,
        )
        if not heading_match:
            continue
        heading = heading_match.group(1).strip()
        details = []
        paragraphs = re.split(r"\n\s*\n", chunk[heading_match.end():])
        for paragraph in paragraphs:
            lines = [line.strip() for line in paragraph.splitlines() if line.strip()]
            if not lines or any(line.startswith(("-", "*", "#")) for line in lines):
                continue
            if any(re.match(r"^\d+[.)]\s+", line) for line in lines):
                break
            detail = re.sub(r"\s+", " ", " ".join(lines)).strip()
            sentence_end = detail.find(".")
            if sentence_end >= 0:
                detail = detail[:sentence_end + 1]
            if detail.endswith(":"):
                continue
            details.append(detail)
            break
        parent_steps.append(
            f"{heading}: {' '.join(details)}" if details else heading
        )
    if parent_steps:
        return parent_steps

    # Other articles use top-level numbered actions directly.
    numbered_steps = re.findall(
        r"(?m)^\s*\d+[.)]\s+(.+?)\s*$",
        procedure,
    )
    return [step.strip() for step in numbered_steps if step.strip()]


def call_llama(complaint, rag_context):
    """Sends the complaint + retrieved KB context to the configured Groq model
    and returns the structured resolution text."""
    client = _get_client()

    max_tokens = int(os.environ.get("GROQ_MAX_TOKENS", "2048"))
    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": f"""
Customer Complaint:

{complaint}

Retrieved Resolution Sources:

{rag_context}

Using the customer complaint and retrieved knowledge,
provide the most appropriate solution.
"""
            }
        ],
        temperature=0.2,
        max_tokens=max_tokens
    )

    return response.choices[0].message.content


def fallback_generate_solution(complaint, retrieved_results):
    if not retrieved_results:
        return (
            "Problem:\nYour issue could not be resolved automatically from our existing knowledge base.\n\n"
            "Recommended Solution:\n1. Your ticket has been forwarded to our senior technical support team.\n2. A support technician will investigate your request and contact you directly.\n\n"
            "Reason:\nNo automated self-service procedure was found for this specific issue.\n\n"
            "Escalation:\nYes\n\nEscalation Reason:\nNo matching knowledge base documentation found - escalated to technician.\n\nConfidence:\nLow"
        )
    top = retrieved_results[0]
    metadata = top.get("metadata", {})
    text = top.get("text", "")
    subcat = metadata.get("subcategory", "General Issue")
    cat = metadata.get("category", "General")
    sec_name = metadata.get("section_name", "Resolution Procedure")

    # Resolver content is authoritative, but only its Correct Solution section
    # is actionable. Complaint, feedback, and metadata are never instructions.
    if metadata.get("source", top.get("source")) == "resolver_base":
        solution_part = extract_solution_source(top)
        if not solution_part:
            solution_part = "Contact support for a technician review."
        return f"""Problem:
Customer reported issue regarding {subcat} ({cat}).

Recommended Solution:
{solution_part}

Reason:
Technician-approved resolution retrieved from master resolver database for {subcat}.

Escalation:
No

Escalation Reason:
Not required

Confidence:
High (100%)"""

    resolution = _markdown_section(text, "Resolution")
    steps = _extract_procedure_steps(text)
    if not steps and resolution:
        steps = [resolution.strip()]

    formatted_steps = []
    for i, s in enumerate(steps[:5], start=1):
        clean_s = re.sub(r"^(?:[-*]|\d+[.)])\s*", "", s).strip()
        clean_s = re.sub(r"\bthe customer(?:'s)?\b", "your", clean_s, flags=re.IGNORECASE)
        clean_s = re.sub(r"\bthe customer\b", "you", clean_s, flags=re.IGNORECASE)
        clean_s = re.sub(r"\bthe support agent should:?\b", "Please", clean_s, flags=re.IGNORECASE)
        if clean_s:
            formatted_steps.append(f"{i}. {clean_s}")
            
    if not formatted_steps:
        formatted_steps = [f"1. Follow standard self-service troubleshooting steps for {subcat} in your account portal."]
        
    steps_str = "\n".join(formatted_steps)
    
    return f"""Problem:
You are experiencing an issue regarding {subcat} ({cat}).

Recommended Solution:
{steps_str}

Reason:
Synthesized from verified Signal CX knowledge base for {sec_name} ({subcat}).

Escalation:
No

Escalation Reason:
Not required

Confidence:
High"""


def generate_solution(complaint, retrieved_results):
    """Convenience wrapper: retrieved_results -> context -> LLM answer with fallback."""
    try:
        rag_context = build_rag_context(retrieved_results)
        response = call_llama(complaint, rag_context)
        if _response_is_usable(response):
            return response
        print("[llm_reasoning] LLM returned an invalid or leaked source format; using clean RAG fallback.")
        return fallback_generate_solution(complaint, retrieved_results)
    except Exception as e:
        print(f"[llm_reasoning] Groq LLM call unavailable ({e}), using RAG fallback synthesis.")
        return fallback_generate_solution(complaint, retrieved_results)
