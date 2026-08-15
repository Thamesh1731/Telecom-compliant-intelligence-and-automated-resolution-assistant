"""
knowledge_loader.py — Storage abstraction layer for the knowledge base.

Current implementation: LOCAL (reads from local knowledge_base/ directory).
Future implementation: AWS S3 (set KNOWLEDGE_BASE_SOURCE=s3 in .env).

The retriever and classifier never import from this file directly;
they use the knowledge_base/ directory via chromadb.
This module is used by the FastAPI backend (main.py) for:
  - Health checks
  - Listing available categories
  - Reading full document content when needed

To add S3 support later:
  1. pip install boto3
  2. Set KNOWLEDGE_BASE_SOURCE=s3 in .env
  3. Implement the S3 branch below
"""

import os
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

KNOWLEDGE_BASE_SOURCE = os.getenv("KNOWLEDGE_BASE_SOURCE", "local")

# Absolute path to the knowledge_base directory, relative to this file
_LOCAL_KB_ROOT = Path(__file__).parent / "knowledge_base"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def get_kb_root() -> Path:
    """Return the local knowledge_base root Path."""
    return _LOCAL_KB_ROOT


def list_categories() -> list[str]:
    """Return a list of available category folder names."""
    if KNOWLEDGE_BASE_SOURCE == "local":
        return _local_list_categories()
    elif KNOWLEDGE_BASE_SOURCE == "s3":
        raise NotImplementedError(
            "S3 knowledge_loader not yet implemented. "
            "Set KNOWLEDGE_BASE_SOURCE=local for now."
        )
    else:
        raise ValueError(f"Unknown KNOWLEDGE_BASE_SOURCE: {KNOWLEDGE_BASE_SOURCE}")


def load_document(category: str, file_name: str) -> str | None:
    """
    Load and return the full text content of a knowledge base document.

    Parameters
    ----------
    category  : folder name under knowledge_base/ (e.g. 'internet')
    file_name : markdown filename (e.g. 'NET-01-no-internet.md')

    Returns
    -------
    str   — full document text, or None if not found
    """
    if KNOWLEDGE_BASE_SOURCE == "local":
        return _local_load_document(category, file_name)
    elif KNOWLEDGE_BASE_SOURCE == "s3":
        # ---------------------------------------------------------------------------
        # AWS S3 implementation (future)
        # ---------------------------------------------------------------------------
        # import boto3
        # s3 = boto3.client("s3")
        # bucket = os.getenv("S3_BUCKET_NAME")
        # key = f"knowledge_base/{category}/{file_name}"
        # try:
        #     obj = s3.get_object(Bucket=bucket, Key=key)
        #     return obj["Body"].read().decode("utf-8")
        # except s3.exceptions.NoSuchKey:
        #     return None
        raise NotImplementedError(
            "S3 knowledge_loader not yet implemented. "
            "Set KNOWLEDGE_BASE_SOURCE=local for now."
        )
    else:
        raise ValueError(f"Unknown KNOWLEDGE_BASE_SOURCE: {KNOWLEDGE_BASE_SOURCE}")


# ---------------------------------------------------------------------------
# Local implementations
# ---------------------------------------------------------------------------

def _local_list_categories() -> list[str]:
    """Return a sorted list of category directory names."""
    if not _LOCAL_KB_ROOT.exists():
        return []
    return sorted(
        d.name for d in _LOCAL_KB_ROOT.iterdir() if d.is_dir()
    )


def _local_load_document(category: str, file_name: str) -> str | None:
    """Read a document from the local knowledge_base directory."""
    file_path = _LOCAL_KB_ROOT / category / file_name
    if file_path.exists():
        return file_path.read_text(encoding="utf-8")

    # Fallback: search anywhere under knowledge_base/
    matches = list(_LOCAL_KB_ROOT.rglob(file_name))
    if matches:
        return matches[0].read_text(encoding="utf-8")

    return None
