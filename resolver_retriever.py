"""Resolver-base storage and retrieval.

Technician-approved solutions are stored as one Markdown file per case under
resolver_base/<category>/ and indexed in a separate Chroma collection. The
resolver base is intentionally separate from the normal knowledge base.
"""

import re
from pathlib import Path

import chromadb

from category_mapper import CATEGORY_MAP
from retriever import embedding_model


PROJECT_ROOT = Path(__file__).parent
RESOLVER_ROOT = PROJECT_ROOT / "resolver_base"
RESOLVER_DB_PATH = PROJECT_ROOT / "chroma_db"
RESOLVER_COLLECTION_NAME = "resolver_base_solutions"
RESOLVER_MATCH_THRESHOLD = 0.55

_CATEGORY_FOLDERS = sorted(set(CATEGORY_MAP.values()) | {"general"})

_client = chromadb.PersistentClient(path=str(RESOLVER_DB_PATH))
resolver_collection = _client.get_or_create_collection(
    name=RESOLVER_COLLECTION_NAME,
    metadata={"hnsw:space": "cosine"},
)


def category_folder(category: str | None) -> str:
    """Convert a display/category value into a safe resolver folder name."""
    value = (category or "general").strip()
    if value in CATEGORY_MAP:
        return CATEGORY_MAP[value]
    if value in _CATEGORY_FOLDERS:
        return value
    value = re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_")
    return value or "general"


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")[:60] or "solution"


def _solution_markdown(item: dict, resolved_solution: str) -> str:
    return f"""# Technician-Approved Resolution

## Complaint

{item.get('complaint', '').strip()}

## User Feedback

{item.get('feedback', '').strip()}

## Correct Solution

{resolved_solution.strip()}

## Metadata

- Feedback ID: {item.get('feedback_id', '')}
- Complaint ID: {item.get('complaint_id', '')}
- Category: {item.get('category', 'General')}
- Subcategory: {item.get('subcategory', 'General')}
- Resolved At: {item.get('resolved_at', '')}
"""


def store_resolver_solution(item: dict, resolved_solution: str) -> Path:
    """Write and index one technician-approved Markdown solution."""
    folder = category_folder(item.get("category"))
    target_dir = RESOLVER_ROOT / folder
    target_dir.mkdir(parents=True, exist_ok=True)

    feedback_id = _slug(item.get("feedback_id", "solution"))
    filename = f"{feedback_id}-{_slug(item.get('subcategory', 'resolution'))}.md"
    target_path = target_dir / filename
    content = _solution_markdown(item, resolved_solution)
    target_path.write_text(content, encoding="utf-8")

    _upsert_file(target_path, content, folder, item)
    return target_path


def _upsert_file(path: Path, content: str, folder: str, item: dict | None = None) -> None:
    metadata = {
        "category": folder,
        "subcategory": str((item or {}).get("subcategory", "General")),
        "file_name": path.name,
        "feedback_id": str((item or {}).get("feedback_id", path.stem)),
        "source": "resolver_base",
    }
    embedding = embedding_model.encode(content).tolist()
    resolver_collection.upsert(
        ids=[path.as_posix()],
        documents=[content],
        metadatas=[metadata],
        embeddings=[embedding],
    )


def sync_resolver_base() -> None:
    """Index existing resolver-base Markdown files at application startup."""
    RESOLVER_ROOT.mkdir(parents=True, exist_ok=True)
    for folder in _CATEGORY_FOLDERS:
        (RESOLVER_ROOT / folder).mkdir(parents=True, exist_ok=True)

    for path in RESOLVER_ROOT.glob("*/*.md"):
        try:
            content = path.read_text(encoding="utf-8")
            _upsert_file(path, content, path.parent.name)
        except OSError:
            continue


def find_resolver_solution(complaint: str, category: str | None = None) -> dict | None:
    """Return the best approved solution when it clears the match threshold."""
    if resolver_collection.count() == 0:
        return None

    query_embedding = embedding_model.encode(complaint).tolist()
    searches = []
    if category:
        searches.append({"category": category_folder(category)})
    searches.append(None)

    results = None
    similarity = 0.0
    for where in searches:
        kwargs = {"query_embeddings": [query_embedding], "n_results": 5}
        if where:
            kwargs["where"] = where
        candidate_results = resolver_collection.query(**kwargs)
        if not candidate_results.get("ids") or not candidate_results["ids"][0]:
            continue
        candidate_similarity = 1 - candidate_results["distances"][0][0]
        if candidate_similarity >= RESOLVER_MATCH_THRESHOLD:
            results = candidate_results
            similarity = candidate_similarity
            break

    if results is None:
        return None

    metadata = results["metadatas"][0][0]
    return {
        "text": results["documents"][0][0],
        "metadata": {
            **metadata,
            "document_id": metadata.get("feedback_id", results["ids"][0][0]),
            "section_name": "Technician-Approved Resolution",
        },
        "similarity": float(similarity),
        "source": "resolver_base",
    }


def resolver_solution_count() -> int:
    return resolver_collection.count()


sync_resolver_base()
