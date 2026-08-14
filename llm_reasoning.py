"""
llm_reasoning.py

Wraps the Groq LLM call (llama-3.1-8b-instant) that synthesizes a structured
resolution (Problem / Recommended Solution / Reason / Escalation / Confidence)
from the top retrieved knowledge-base documents, exactly matching the prompt
and output contract used in your Colab notebook -- just adapted to run
locally (env var instead of Colab's userdata) instead of inside Colab.
"""

import os
from groq import Groq

GROQ_MODEL = "llama-3.1-8b-instant"

SYSTEM_PROMPT = """
You are a Telecom Customer Support Resolution Assistant.

Your job is to analyze the customer's complaint and provide a safe,
accurate, concise resolution using ONLY the information provided in
the retrieved telecom knowledge base.

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
        _client = Groq(api_key=api_key)
    return _client


def build_rag_context(results):
    """Same formatting as the notebook -- turns retrieve() results into
    the text block handed to the LLM as retrieved knowledge."""
    context = []
    for i, result in enumerate(results, start=1):
        metadata = result["metadata"]
        context.append(
            f"""
--- Knowledge Result {i} ---

Document ID: {metadata.get("document_id", "Unknown")}
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

Retrieved Knowledge Base:

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


def generate_solution(complaint, retrieved_results):
    """Convenience wrapper: retrieved_results -> context -> LLM answer."""
    rag_context = build_rag_context(retrieved_results)
    return call_llama(complaint, rag_context)
