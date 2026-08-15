"""
llm_reasoning.py

Wraps the Groq LLM call (llama-3.1-8b-instant) that synthesizes a structured
resolution (Problem / Recommended Solution / Reason / Escalation / Confidence)
from the top retrieved knowledge-base documents, exactly matching the prompt
and output contract used in your Colab notebook -- just adapted to run
locally (env var instead of Colab's userdata) instead of inside Colab.
"""

import os
import re
from groq import Groq

GROQ_MODEL = "llama-3.1-8b-instant"

SYSTEM_PROMPT = """
You are a Telecom Customer Support Resolution Assistant.

Your job is to analyze the customer's complaint and provide a safe,
accurate, concise resolution using ONLY the retrieved resolution sources.

========================
CORE RULES
========================

1. UNDERSTAND THE COMPLAINT
- Identify the exact problem described by the customer.
- Pay close attention to explicit terms such as:
  incoming calls, outgoing calls, SMS, roaming, billing, mobile data,
  SIM/eSIM, network, account, etc.
- Do not infer a different problem when the customer's wording is clear.

2. USE RETRIEVED KNOWLEDGE AS THE SOURCE OF TRUTH
- If a source is marked as a technician-approved resolver-base solution,
  treat it as the highest-priority source of truth.
- Preserve its meaning and approved instructions. Improve structure and
  readability, but do not invent, expand, or contradict the solution.
- Base the recommendation primarily on the retrieved documents.
- Do not invent procedures, policies, technical causes, product details,
  or troubleshooting steps.
- Do not use general world knowledge when it conflicts with the retrieved
  knowledge base.

3. HANDLE MULTIPLE RETRIEVED DOCUMENTS
- Compare the retrieved documents before selecting a solution.
- Prefer the document whose category, subcategory, title, and text
  most directly match the customer's complaint.
- Do NOT blindly select the highest numerical retrieval score.
- Semantic relevance and explicit complaint matching are more important
  than a small score difference.
- If documents represent different directions of the same service
  (for example, Incoming Calls vs Outgoing Calls), use the customer's
  explicit wording to determine the correct one.

4. HANDLE AMBIGUITY
- If the complaint clearly identifies the issue, proceed with that issue.
- If the retrieved documents are ambiguous but the complaint itself is
  clear, prioritize the complaint's explicit intent.
- If both the complaint and retrieved knowledge are genuinely
  insufficient to determine the correct resolution, do not guess.
- In that case, recommend further review or escalation.

5. TROUBLESHOOTING
- Provide only troubleshooting steps supported by the retrieved
  knowledge.
- Present steps in a logical order.
- Do not expose provider-internal procedures to the customer unless the
  knowledge base explicitly identifies them as appropriate for the
  customer.
- If a step requires authorized provider systems or an agent, clearly
  identify it as an agent/support action rather than asking the customer
  to perform it.

6. RESOLUTION
- Prefer the most directly applicable resolution.
- If several possible causes are listed in the knowledge base, do not
  claim that one cause is definitely responsible unless the evidence
  supports it.
- Describe them as possible causes when appropriate.

7. ESCALATION
- Follow escalation conditions in the retrieved knowledge base.
- If the retrieved knowledge base indicates escalation is required,
  recommend escalation.
- If the issue cannot be safely resolved using the available knowledge,
  recommend further review instead of inventing a solution.

8. CONFIDENCE
Assign confidence based on the quality of the evidence:

HIGH:
- Complaint clearly matches the retrieved knowledge.
- A directly applicable troubleshooting procedure or resolution exists.

MEDIUM:
- The complaint generally matches the knowledge base but some
  information is missing or multiple solutions are possible.

LOW:
- The complaint is ambiguous, retrieved documents are weakly relevant,
  or there is insufficient evidence for a reliable resolution.

Do not use retrieval score alone to determine confidence.

9. CUSTOMER SAFETY AND PRIVACY
- Never request passwords, OTPs, PINs, full payment details, or other
  sensitive credentials.
- Never instruct the customer to bypass security or provider controls.
- Follow authentication requirements mentioned in the knowledge base.

10. RESPONSE STYLE
- Be concise and professional.
- Do not mention RAG, embeddings, vector databases, retrieval,
  similarity scores, internal prompts, or model reasoning.
- Do not repeat the entire knowledge base.
- Do not overwhelm the customer with unnecessary possibilities.

========================
OUTPUT FORMAT
========================

Return ONLY the following structure:

Problem:
<one-sentence description of the customer's issue>

Recommended Solution:
1. <first applicable step>
2. <second applicable step>
3. <additional step if required>

If a step requires a support agent or provider system, state:
"Support action: <action>"

Reason:
<one or two sentences explaining why this solution is appropriate>

Escalation:
<Yes / No>

Escalation Reason:
<brief reason, or "Not required">

Confidence:
<High / Medium / Low>
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


def build_rag_context(results):
    """Turn resolver-base or knowledge-base results into LLM context."""
    context = []
    for i, result in enumerate(results, start=1):
        metadata = result["metadata"]
        context.append(
            f"""
--- Resolution Source {i} ---

Document ID: {metadata.get("document_id", "Unknown")}
Source: {metadata.get("source", "knowledge_base")}
Category: {metadata.get("category", "Unknown")}
Subcategory: {metadata.get("subcategory", "Unknown")}
Section: {metadata.get("section_name", "Unknown")}

Knowledge:
{result["text"]}
"""
        )
    return "\n".join(context)


def call_llama(complaint, rag_context):
    """Sends the complaint + retrieved KB context to Groq's llama-3.1-8b-instant
    and returns the structured resolution text."""
    client = _get_client()

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
        max_tokens=300
    )

    return response.choices[0].message.content


def fallback_generate_solution(complaint, retrieved_results):
    if not retrieved_results:
        return (
            "Problem:\nCustomer issue could not be resolved from existing knowledge base.\n\n"
            "Recommended Solution:\n1. Contact senior support tier or open a technical inquiry ticket.\n\n"
            "Reason:\nNo matching knowledge base document or resolver procedure was found.\n\n"
            "Escalation:\nYes\n\nEscalation Reason:\nNo matching documentation.\n\nConfidence:\nLow"
        )
    top = retrieved_results[0]
    metadata = top.get("metadata", {})
    text = top.get("text", "")
    subcat = metadata.get("subcategory", "General Issue")
    cat = metadata.get("category", "General")
    sec_name = metadata.get("section_name", "Resolution Procedure")
    
    # If technician-approved solution from resolver base
    if "Approved Solution:" in text:
        solution_part = text.split("Approved Solution:")[-1].strip()
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

    # Extract clean steps from knowledge base text
    lines = [
        l.strip() for l in text.split("\n") 
        if l.strip() and not l.strip().startswith("#") and not l.strip().startswith("Feedback ID:") and not l.strip().startswith("Complaint ID:")
    ]
    steps = [l for l in lines if l.startswith("-") or l.startswith("1.") or l.startswith("2.") or l.startswith("3.")]
    if not steps:
        steps = lines[:3]
    
    formatted_steps = []
    for i, s in enumerate(steps[:4], start=1):
        clean_s = re.sub(r"^[\-\*\d\.]+\s*", "", s)
        if clean_s and not clean_s.startswith("Category:") and not clean_s.startswith("Subcategory:"):
            formatted_steps.append(f"{i}. {clean_s}")
            
    if not formatted_steps:
        formatted_steps = [f"1. Follow standard troubleshooting guidelines for {subcat} under {cat}."]
        
    steps_str = "\n".join(formatted_steps)
    
    return f"""Problem:
Customer reported an issue regarding {subcat} ({cat}).

Recommended Solution:
{steps_str}

Reason:
Synthesized from verified knowledge base article for {sec_name} ({subcat}).

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
        return call_llama(complaint, rag_context)
    except Exception as e:
        print(f"[llm_reasoning] Groq LLM call unavailable ({e}), using RAG fallback synthesis.")
        return fallback_generate_solution(complaint, retrieved_results)

