from pathlib import Path
import re


# Path to your knowledge base
KB_PATH = Path("knowledge_base")


def extract_subcategory(content):
    """
    Extracts the value under:
    ## Subcategory
    """

    match = re.search(
        r"##\s*Subcategory\s*\n+(.+?)(?:\n|$)",
        content,
        re.IGNORECASE
    )

    if match:
        return match.group(1).strip()

    return "Unknown"


def extract_source_basis(content):
    """
    Extracts everything under:
    ## Source Basis
    """

    match = re.search(
        r"##\s*Source Basis\s*\n+(.*?)(?=\n##\s|\Z)",
        content,
        re.IGNORECASE | re.DOTALL
    )

    if match:
        return match.group(1).strip()

    return "Unknown"


def extract_document_title(content):
    """
    Extracts the document title from the first heading line.
    Example: "# CALL-04: Call Drops and Call Quality" -> "Call Drops and Call Quality"
    """
    lines = content.splitlines()
    if lines:
        first_line = lines[0].strip()
        if first_line.startswith("# "):
            title = first_line[2:].strip()
            if ":" in title:
                return title.split(":", 1)[1].strip()
            return title
    return "Unknown"


def create_metadata(file_path, content):
    """
    Creates metadata automatically from the file structure
    and Markdown content.
    """

    filename = file_path.name
    file_stem = file_path.stem

    # Example:
    # CALL-02-incoming-calls.md
    #
    # document_id = CALL-02

    parts = file_stem.split("-")

    if len(parts) >= 2:
        document_id = f"{parts[0]}-{parts[1]}"
    else:
        document_id = file_stem

    # Folder name becomes category code
    # Example: knowledge_base/CALL/...
    category = file_path.parent.name

    # Extract document title
    document_title = extract_document_title(content)

    # Extract subcategory from Markdown
    subcategory = extract_subcategory(content)
    if subcategory == "Unknown":
        subcategory = document_title

    # Extract source basis
    source_basis = extract_source_basis(content)

    return {
        "document_id": document_id,
        "document_title": document_title,
        "category": category,
        "subcategory": subcategory,
        "file_name": filename,
        "source": "knowledge_base",
        "source_basis": source_basis
    }


def load_documents():
    """
    Loads every Markdown file from the knowledge base.
    """

    documents = []

    if not KB_PATH.exists():
        raise FileNotFoundError(
            f"Knowledge base not found: {KB_PATH.absolute()}"
        )

    markdown_files = list(KB_PATH.rglob("*.md"))

    print(f"Found {len(markdown_files)} Markdown files.")

    for file_path in markdown_files:

        try:
            content = file_path.read_text(
                encoding="utf-8"
            )

            metadata = create_metadata(
                file_path,
                content
            )

            document = {
                "text": content,
                "metadata": metadata
            }

            documents.append(document)

        except Exception as e:
            print(f"Error loading {file_path}: {e}")

    return documents


if __name__ == "__main__":

    documents = load_documents()

    print(f"\nLoaded {len(documents)} documents.\n")

    for doc in documents[:5]:

        print("=" * 60)

        print("Document ID:",
              doc["metadata"]["document_id"])

        print("Category:",
              doc["metadata"]["category"])

        print("Subcategory:",
              doc["metadata"]["subcategory"])

        print("File:",
              doc["metadata"]["file_name"])

        print("Source:",
              doc["metadata"]["source"])

        print("Source Basis:",
              doc["metadata"]["source_basis"][:150],
              "...")

        print()