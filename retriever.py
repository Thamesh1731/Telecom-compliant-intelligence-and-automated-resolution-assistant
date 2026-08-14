import chromadb
from sentence_transformers import SentenceTransformer
import numpy as np
import re
import joblib

from category_mapper import map_category


# ============================================================
# CONFIGURATION
# ============================================================

DB_PATH = "chroma_db"
COLLECTION_NAME = "telecom_knowledge_base"

EMBEDDING_MODEL = "all-MiniLM-L6-v2"

CANDIDATE_K = 25
TOP_K = 5

MAX_CHUNKS_PER_DOCUMENT = 4

# Document Scoring Weights (Level 1)
DOC_TEXT_WEIGHT = 0.50
DOC_SUBCATEGORY_WEIGHT = 0.20
DOC_INTENT_WEIGHT = 0.15
DOC_CATEGORY_WEIGHT = 0.15
AMBIGUITY_THRESHOLD = 0.05

# Chunk Scoring Weights (Level 2 & 3)
TEXT_WEIGHT = 0.40
SUBCATEGORY_WEIGHT = 0.15
INTENT_WEIGHT = 0.15
CATEGORY_WEIGHT = 0.15
SECTION_WEIGHT = 0.15


# ============================================================
# LOAD MODELS
# ============================================================

print("Loading embedding model...")

embedding_model = SentenceTransformer(
    EMBEDDING_MODEL
)


print("Loading category classifier...")

classifier = joblib.load(
    r"F:\cts projecty\complaint_classifier_final.joblib"
)


# ============================================================
# CONNECT TO CHROMADB
# ============================================================

client = chromadb.PersistentClient(
    path=DB_PATH
)

collection = client.get_collection(
    name=COLLECTION_NAME
)


# ============================================================
# CATEGORY NORMALIZATION
# ============================================================

def normalize_category(category):

    if not category:
        return None

    return map_category(category)


# ============================================================
# CATEGORY CLASSIFICATION
# ============================================================

def classify_category(query):
    """
    Uses the trained .joblib classifier.

    Returns the ranked category predictions.
    """

    query = str(query).strip()

    probabilities = classifier.predict_proba(
        [query]
    )[0]

    classes = classifier.classes_

    ranked = sorted(
        zip(classes, probabilities),
        key=lambda x: x[1],
        reverse=True
    )

    return ranked


# ============================================================
# CALLING INTENT DETECTION
# ============================================================

def detect_calling_intent(query):

    text = query.lower().strip()

    # --------------------------------------------------------
    # Incoming calls
    # --------------------------------------------------------

    incoming_patterns = [

        r"\bnobody can call me\b",
        r"\bno one can call me\b",
        r"\bpeople cannot call me\b",
        r"\bpeople can't call me\b",

        r"\bcan't receive calls\b",
        r"\bcannot receive calls\b",

        r"\bcan't receive incoming calls\b",
        r"\bcannot receive incoming calls\b",

        r"\bcan't get calls\b",
        r"\bcannot get calls\b",

        r"\bnot receiving calls\b",
        r"\bnot getting calls\b",

        r"\bincoming calls.*not",
        r"\bincoming calls.*fail",

        r"\bcalls.*not reaching me\b",
        r"\bcalls.*don't reach me\b",
        r"\bcalls.*do not reach me\b",

        r"\bcallers.*can't reach me\b",
        r"\bcallers.*cannot reach me\b",

        r"\bcallers.*can't get through\b",
        r"\bcallers.*cannot get through\b"
    ]

    for pattern in incoming_patterns:

        if re.search(pattern, text):
            return "incoming_calls"


    # --------------------------------------------------------
    # Outgoing calls
    # --------------------------------------------------------

    outgoing_patterns = [

        r"\bcan't make calls\b",
        r"\bcannot make calls\b",

        r"\bcan't make a call\b",
        r"\bcannot make a call\b",

        r"\bcan't call anyone\b",
        r"\bcannot call anyone\b",

        r"\bcan't call out\b",
        r"\bcannot call out\b",

        r"\boutgoing calls.*not",
        r"\boutgoing calls.*fail",

        r"\boutgoing calls.*don't work\b",
        r"\boutgoing calls.*do not work\b",

        r"\bunable to make calls\b",
        r"\bunable to make a call\b"
    ]

    for pattern in outgoing_patterns:

        if re.search(pattern, text):
            return "outgoing_calls"


    # --------------------------------------------------------
    # Call quality / dropped calls
    # --------------------------------------------------------

    call_quality_patterns = [

        r"\bcalls keep dropping\b",
        r"\bcall keeps dropping\b",

        r"\bcalls drop\b",
        r"\bcall drops\b",

        r"\bcalls disconnect\b",
        r"\bcall disconnects\b",

        r"\bcall gets disconnected\b",

        r"\bvoice keeps cutting\b",
        r"\bvoice keeps cutting out\b",

        r"\bcall quality\b",
        r"\bpoor call quality\b",

        r"\bvoice is breaking\b",
        
        r"\bcall.*cutting\b",
        r"\bcalls.*cutting\b"
    ]

    for pattern in call_quality_patterns:

        if re.search(pattern, text):
            return "call_quality"


    # --------------------------------------------------------
    # Caller ID
    # --------------------------------------------------------

    caller_id_patterns = [

        r"\bcaller id\b",

        r"\bwrong number displayed\b",
        r"\bwrong number showing\b",
        r"\bwrong number appears\b",

        r"\bnumber displayed.*wrong\b",

        r"\bshows the wrong number\b",
        r"\bshows a different number\b",

        r"\bprivate number\b",
        r"\bunknown number\b",

        r"\bcaller name\b"
    ]

    for pattern in caller_id_patterns:

        if re.search(pattern, text):
            return "caller_id"


    # --------------------------------------------------------
    # General number problem
    # --------------------------------------------------------

    number_patterns = [

        r"\bmy number is not working\b",
        r"\bmy number doesn't work\b",
        r"\bmy number does not work\b",

        r"\bphone number not working\b",

        r"\bnumber stopped working\b"
    ]

    for pattern in number_patterns:

        if re.search(pattern, text):
            return "number_not_working"


    return None


# ============================================================
# INTENT → KB SUBCATEGORY
# ============================================================

INTENT_SUBCATEGORY_MAP = {

    "incoming_calls":
        "Incoming Calls Not Working",

    "outgoing_calls":
        "Outgoing Calls Not Working",

    "call_quality":
        "Dropped Calls and Poor Call Quality",

    "caller_id":
        "Caller ID, Number Display, and Number Identity Issues",

    "number_not_working":
        "Mobile Number Not Working"
}


# ============================================================
# COSINE SIMILARITY
# ============================================================

def cosine_similarity(vector_a, vector_b):

    vector_a = np.array(vector_a)
    vector_b = np.array(vector_b)

    denominator = (
        np.linalg.norm(vector_a)
        *
        np.linalg.norm(vector_b)
    )

    if denominator == 0:
        return 0

    return np.dot(
        vector_a,
        vector_b
    ) / denominator


# ============================================================
# VECTOR SEARCH
# ============================================================

def vector_search(
    query,
    category=None,
    n_results=CANDIDATE_K
):

    query_embedding = embedding_model.encode(
        query
    ).tolist()

    search_parameters = {
        "query_embeddings": [query_embedding],
        "n_results": n_results
    }

    if category:

        search_parameters["where"] = {
            "category": category
        }

    results = collection.query(
        **search_parameters
    )

    return results, query_embedding


# ============================================================
# SECTION USEFULNESS SCORER
# ============================================================

def get_section_usefulness(section_name):
    """
    Returns a section usefulness score between 0.0 and 1.0 based on keyword matching.
    """
    name = section_name.strip().lower()

    if "source basis" in name or "scalability requirements" in name:
        return 0.0

    # High priority keywords
    high_keywords = [
        "troubleshooting procedure", "resolution", "recommended action",
        "human agent action", "escalation conditions", "escalation",
        "human action", "recommended human action", "how to resolve",
        "actionable", "step-by-step"
    ]
    for kw in high_keywords:
        if kw in name:
            return 1.0

    # Medium-high priority keywords
    med_high_keywords = [
        "possible causes", "diagnostic steps", "eligibility",
        "requirements", "service conditions", "initial diagnosis",
        "diagnosis guidance", "diagnostic interpretation", "possible cause",
        "diagnosis"
    ]
    for kw in med_high_keywords:
        if kw in name:
            return 0.7

    # Low priority keywords
    low_keywords = [
        "example", "sample", "complaint example", "destination-specific failure",
        "location-specific issue", "large-scale workflow"
    ]
    for kw in low_keywords:
        if kw in name:
            return 0.1

    # Medium priority keywords
    med_keywords = [
        "common symptoms", "symptoms", "problem", "overview", "important notes", "notes"
    ]
    for kw in med_keywords:
        if kw in name:
            return 0.4

    # Default for other content sections
    return 0.5


# ============================================================
# RERANK RESULTS
# ============================================================

def rerank_results(
    query,
    query_embedding,
    results,
    detected_intent=None,
    kb_category_probs=None
):

    if not results["documents"]:
        return []

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    reranked = []

    target_subcategory = (
        INTENT_SUBCATEGORY_MAP.get(
            detected_intent
        )
    )

    if kb_category_probs is None:
        kb_category_probs = {}

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances
    ):

        subcategory = metadata.get(
            "subcategory",
            ""
        )

        # ----------------------------------------------------
        # Semantic text similarity
        # ----------------------------------------------------

        text_similarity = 1 / (
            1 + distance
        )

        # ----------------------------------------------------
        # Subcategory similarity
        # ----------------------------------------------------

        subcategory_embedding = (
            embedding_model.encode(
                subcategory
            ).tolist()
        )

        subcategory_similarity = (
            cosine_similarity(
                query_embedding,
                subcategory_embedding
            )
        )

        # ----------------------------------------------------
        # Explicit intent match
        # ----------------------------------------------------

        intent_score = 0

        if target_subcategory:

            if (
                subcategory.lower()
                ==
                target_subcategory.lower()
            ):

                intent_score = 1.0

            elif (
                target_subcategory.lower()
                in
                subcategory.lower()
            ):

                intent_score = 0.75

        # ----------------------------------------------------
        # Category compatibility
        # ----------------------------------------------------

        chunk_category = metadata.get("category", "")
        category_compatibility = kb_category_probs.get(chunk_category, 0.0)

        # ----------------------------------------------------
        # Section usefulness
        # ----------------------------------------------------

        section_name = metadata.get("section_name", "Overview")
        section_usefulness = get_section_usefulness(section_name)

        # ----------------------------------------------------
        # Final score
        # ----------------------------------------------------

        final_score = (

            TEXT_WEIGHT
            *
            text_similarity

            +

            SUBCATEGORY_WEIGHT
            *
            subcategory_similarity

            +

            INTENT_WEIGHT
            *
            intent_score

            +

            CATEGORY_WEIGHT
            *
            category_compatibility

            +

            SECTION_WEIGHT
            *
            section_usefulness
        )

        reranked.append({

            "text": document,

            "metadata": metadata,

            "distance": distance,

            "text_similarity":
                text_similarity,

            "subcategory_similarity":
                subcategory_similarity,

            "intent_score":
                intent_score,

            "category_compatibility":
                category_compatibility,

            "section_usefulness":
                section_usefulness,

            "final_score":
                final_score
        })


    reranked.sort(
        key=lambda x: x["final_score"],
        reverse=True
    )

    return reranked


# ============================================================
# REMOVE DUPLICATE DOCUMENTS
# ============================================================

def remove_duplicate_documents(results, top_k=TOP_K):
    """
    Selects top_k diverse chunks using a greedy penalty-based diversification algorithm (MMR-style).
    Avoids returning multiple chunks from the same document of the same section, and promotes document diversity.
    """
    if not results:
        return []

    candidates = list(results)
    selected = []
    
    selected_docs_count = {}
    selected_sections_by_doc = {}

    while len(selected) < top_k and candidates:
        best_candidate = None
        best_adjusted_score = -999999.0
        best_candidate_idx = -1

        for i, candidate in enumerate(candidates):
            doc_id = candidate["metadata"].get("document_id", "unknown")
            section_name = candidate["metadata"].get("section_name", "Overview")

            # Base score
            score = candidate["final_score"]

            # Penalties
            penalty = 0.0

            # 1. Document repetition penalty (encourages document diversity)
            doc_count = selected_docs_count.get(doc_id, 0)
            if doc_count > 0:
                penalty += 0.08 * doc_count  # small penalty per existing chunk

            # 2. Section repetition penalty (prevents duplicate sections in same document)
            doc_sections = selected_sections_by_doc.get(doc_id, set())
            if section_name in doc_sections:
                penalty += 0.25  # high penalty for identical section

            adjusted_score = score - penalty

            if adjusted_score > best_adjusted_score:
                best_adjusted_score = adjusted_score
                best_candidate = candidate
                best_candidate_idx = i

        if best_candidate is not None:
            doc_id = best_candidate["metadata"].get("document_id", "unknown")
            section_name = best_candidate["metadata"].get("section_name", "Overview")

            # Update selected state
            selected.append(best_candidate)
            selected_docs_count[doc_id] = selected_docs_count.get(doc_id, 0) + 1
            if doc_id not in selected_sections_by_doc:
                selected_sections_by_doc[doc_id] = set()
            selected_sections_by_doc[doc_id].add(section_name)

            # Print logging explanation for chunk selection
            base_score = round(best_candidate["final_score"], 4)
            adj_score = round(best_adjusted_score, 4)
            print(f"Selected Chunk: {doc_id} | {section_name:<25} (Base Score: {base_score}, Adjusted Score: {adj_score})")

            # Remove from candidate pool
            candidates.pop(best_candidate_idx)
        else:
            break

    return selected


# ============================================================
# MAIN RETRIEVER
# ============================================================

def retrieve(
    query,
    predicted_category=None,
    top_k=TOP_K
):

    # --------------------------------------------------------
    # CATEGORY CLASSIFIER (Build soft category compatibility map)
    # --------------------------------------------------------

    ranked_categories = classify_category(query)

    if predicted_category is not None:
        # If predicted_category is explicitly passed, override and assign full probability to it
        print(f"\nUsing explicitly passed category: {predicted_category}")
        category = normalize_category(predicted_category)
        kb_category_probs = {category: 1.0} if category else {}
    else:
        # Standard path: print top 3 predicted categories and use their probabilities
        print("\nTop 3 predicted categories:")
        print("-" * 55)

        for rank, (category_name, probability) in enumerate(
            ranked_categories[:3],
            start=1
        ):
            print(
                f"{rank}. "
                f"{category_name:<28} "
                f"{probability:.2%}"
            )

        kb_category_probs = {}
        for class_name, prob in ranked_categories[:3]:
            kb_cat = normalize_category(class_name)
            if kb_cat:
                kb_category_probs[kb_cat] = kb_category_probs.get(kb_cat, 0.0) + prob

    # --------------------------------------------------------
    # Detect intent (Runs independently of classifier)
    # --------------------------------------------------------

    detected_intent = detect_calling_intent(query)
    print("\nDetected intent:", detected_intent)

    # --------------------------------------------------------
    # Unfiltered semantic vector search across the full KB
    # --------------------------------------------------------

    results, query_embedding = vector_search(
        query=query,
        category=None,  # No category hard filter!
        n_results=CANDIDATE_K
    )

    if not results["documents"] or not results["documents"][0]:
        print("\nNo candidate documents found in vector store.")
        return []

    # --------------------------------------------------------
    # LEVEL 1: DOCUMENT RETRIEVAL & SCORING
    # --------------------------------------------------------

    documents_meta = {}

    for doc_text, metadata, distance in zip(
        results["documents"][0],
        results["metadatas"][0],
        results["distances"][0]
    ):
        doc_id = metadata.get("document_id")
        if not doc_id:
            continue

        if doc_id not in documents_meta:
            documents_meta[doc_id] = {
                "category": metadata.get("category", ""),
                "subcategory": metadata.get("subcategory", "") or metadata.get("document_title", "Unknown"),
                "document_title": metadata.get("document_title", "Unknown"),
                "max_similarity": 0.0
            }

        sim = 1 / (1 + distance)
        if sim > documents_meta[doc_id]["max_similarity"]:
            documents_meta[doc_id]["max_similarity"] = sim

    # Compute document relevance scores
    doc_scores = []
    target_subcategory = INTENT_SUBCATEGORY_MAP.get(detected_intent) if detected_intent else None

    for doc_id, meta in documents_meta.items():
        # Text similarity (max chunk similarity)
        sem_sim = meta["max_similarity"]

        # Subcategory similarity
        subcat = meta["subcategory"]
        subcat_emb = embedding_model.encode(subcat).tolist()
        subcat_sim = cosine_similarity(query_embedding, subcat_emb)

        # Intent matching
        intent_sig = 0.0
        if target_subcategory:
            if subcat.lower() == target_subcategory.lower():
                intent_sig = 1.0
            elif target_subcategory.lower() in subcat.lower():
                intent_sig = 0.75

        # Category compatibility
        cat_comp = kb_category_probs.get(meta["category"], 0.0)

        # Weighted score
        doc_score = (
            DOC_TEXT_WEIGHT * sem_sim +
            DOC_SUBCATEGORY_WEIGHT * subcat_sim +
            DOC_INTENT_WEIGHT * intent_sig +
            DOC_CATEGORY_WEIGHT * cat_comp
        )

        doc_scores.append({
            "document_id": doc_id,
            "document_title": meta["document_title"],
            "score": doc_score
        })

    # Sort documents by relevance score
    doc_scores.sort(key=lambda x: x["score"], reverse=True)

    # --------------------------------------------------------
    # LEVEL 2: AMBIGUITY / CONFIDENCE DETECTION
    # --------------------------------------------------------

    is_ambiguous = False
    selected_docs = []

    if doc_scores:
        selected_docs.append(doc_scores[0])
        print(f"\nTop Document: {doc_scores[0]['document_id']} ({doc_scores[0]['document_title']}) - Score: {doc_scores[0]['score']:.4f}")

        if len(doc_scores) > 1:
            score_diff = doc_scores[0]["score"] - doc_scores[1]["score"]
            print(f"Second Document: {doc_scores[1]['document_id']} ({doc_scores[1]['document_title']}) - Score: {doc_scores[1]['score']:.4f} (Diff: {score_diff:.4f})")

            # Ambiguous if difference is within threshold and scores are reasonably high
            if score_diff <= AMBIGUITY_THRESHOLD and doc_scores[0]["score"] >= 0.35:
                is_ambiguous = True
                selected_docs.append(doc_scores[1])
                print("Retrieval status: AMBIGUOUS (confidence is divided between top documents).")
            else:
                print("Retrieval status: CONFIDENT (clear primary document identified).")
    else:
        print("\nNo documents ranked.")
        return []

    # --------------------------------------------------------
    # LEVEL 3: ASSOCIATED KNOWLEDGE RETRIEVAL (Full doc chunks query)
    # --------------------------------------------------------

    all_chunks = []
    for doc in selected_docs:
        doc_id = doc["document_id"]
        # Fetch all chunks of the selected document from ChromaDB
        doc_results = collection.query(
            query_embeddings=[query_embedding],
            where={"document_id": doc_id},
            n_results=20
        )

        if doc_results["documents"] and doc_results["documents"][0]:
            for text, meta, dist in zip(
                doc_results["documents"][0],
                doc_results["metadatas"][0],
                doc_results["distances"][0]
            ):
                all_chunks.append({
                    "text": text,
                    "metadata": meta,
                    "distance": dist
                })

    if not all_chunks:
        print("\nNo chunks retrieved for the selected document(s).")
        return []

    # Construct merged results dictionary
    merged_results = {
        "documents": [[c["text"] for c in all_chunks]],
        "metadatas": [[c["metadata"] for c in all_chunks]],
        "distances": [[c["distance"] for c in all_chunks]]
    }

    # Rerank chunks of selected document(s)
    reranked = rerank_results(
        query=query,
        query_embedding=query_embedding,
        results=merged_results,
        detected_intent=detected_intent,
        kb_category_probs=kb_category_probs
    )

    # Greedily diversify and select top_k chunks
    retrieved = remove_duplicate_documents(reranked, top_k=top_k)

    # Inject ambiguity metadata
    for r in retrieved:
        r["is_ambiguous"] = is_ambiguous
        r["metadata"]["is_ambiguous"] = str(is_ambiguous)

    return retrieved[:top_k]


# ============================================================
# DISPLAY RESULTS
# ============================================================

def display_results(results):

    print("\n")
    print("=" * 70)
    print("TELECOM RAG RETRIEVAL RESULTS")
    print("=" * 70)

    if not results:

        print("No relevant knowledge found.")

        return


    for i, result in enumerate(
        results,
        start=1
    ):

        metadata = result["metadata"]

        print(
            f"\nRESULT {i}"
        )

        print("-" * 70)

        print(
            "Document:",
            metadata.get(
                "document_id",
                "Unknown"
            )
        )

        print(
            "Category:",
            metadata.get(
                "category",
                "Unknown"
            )
        )

        print(
            "Subcategory:",
            metadata.get(
                "subcategory",
                "Unknown"
            )
        )

        print(
            "Final Score:",
            round(
                result["final_score"],
                4
            )
        )

        print(
            "Text Similarity:",
            round(
                result["text_similarity"],
                4
            )
        )

        print(
            "Subcategory Similarity:",
            round(
                result["subcategory_similarity"],
                4
            )
        )

        print(
            "Intent Score:",
            round(
                result["intent_score"],
                4
            )
        )

        print(
            "Category Compatibility:",
            round(
                result["category_compatibility"],
                4
            )
        )

        print(
            "Section Usefulness:",
            round(
                result.get("section_usefulness", 0.0),
                4
            )
        )

        print(
            "Original Distance:",
            round(
                result["distance"],
                4
            )
        )

        print("\nText:")

        print(
            result["text"][:1000]
        )


# ============================================================
# TEST MODE
# ============================================================

if __name__ == "__main__":

    print("\nTelecom RAG Retriever")
    print("=" * 70)

    query = input(
        "\nEnter customer complaint: "
    )

    results = retrieve(
        query=query
    )

    display_results(results)