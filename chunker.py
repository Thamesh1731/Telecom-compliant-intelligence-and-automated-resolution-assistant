from loader import load_documents


# Approximate target size for each chunk
CHUNK_SIZE = 1200

# Small overlap helps preserve context between chunks
CHUNK_OVERLAP = 150


def split_into_sections(text):
    """
    Split Markdown content by ## headings.
    """

    sections = []

    parts = text.split("\n## ")

    for i, part in enumerate(parts):

        if i == 0:
            section = part.strip()
        else:
            section = "## " + part.strip()

        if section:
            sections.append(section)

    return sections


def split_large_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    """
    Split a large section into smaller overlapping chunks.
    """

    if len(text) <= chunk_size:
        return [text]

    chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        chunk = text[start:end].strip()

        if chunk:
            chunks.append(chunk)

        if end >= len(text):
            break

        start = end - overlap

    return chunks


EXCLUDED_SECTIONS = {
    "Category",
    "Subcategory",
    "Source Basis",
    "Scalability Requirements",
    "Human Agent Workflow",
    "Agent Guidance"
}


def extract_section_name(section_text):
    """
    Extract the section name from the first line starting with ##.
    If no heading is found, defaults to 'Overview'.
    """
    first_line = section_text.split('\n')[0].strip()
    if first_line.startswith("## "):
        return first_line[3:].strip()
    return "Overview"


def create_chunks(documents):
    """
    Convert loaded documents into smaller chunks while
    preserving the original document metadata and appending parent context.
    """

    chunks = []

    for document in documents:

        text = document["text"]
        metadata = document["metadata"]

        sections = split_into_sections(text)

        chunk_number = 0

        for section in sections:
            section_name = extract_section_name(section)

            # Skip generic/noisy sections
            if section_name in EXCLUDED_SECTIONS:
                continue

            section_chunks = split_large_text(section)

            for chunk in section_chunks:

                chunk_metadata = metadata.copy()

                chunk_metadata["chunk_id"] = (
                    f"{metadata['document_id']}-chunk-{chunk_number}"
                )

                chunk_metadata["chunk_number"] = chunk_number
                chunk_metadata["section_name"] = section_name

                # Construct context-enriched text for embedding
                doc_id = metadata.get("document_id", "Unknown")
                doc_title = metadata.get("document_title", "Unknown")
                cat = metadata.get("category", "Unknown")

                contextual_text = (
                    f"Document ID: {doc_id}\n"
                    f"Document Title: {doc_title}\n"
                    f"Category: {cat}\n"
                    f"Section: {section_name}\n\n"
                    f"{chunk}"
                )

                chunks.append({
                    "text": contextual_text,
                    "metadata": chunk_metadata
                })

                chunk_number += 1

    return chunks


if __name__ == "__main__":

    print("Loading documents...")

    documents = load_documents()

    print(f"Loaded {len(documents)} documents.")

    print("Creating chunks...")

    chunks = create_chunks(documents)

    print(f"Created {len(chunks)} chunks.\n")

    for chunk in chunks[:5]:

        print("=" * 70)

        print("Chunk ID:")
        print(chunk["metadata"]["chunk_id"])

        print("Document:")
        print(chunk["metadata"]["document_id"])

        print("Category:")
        print(chunk["metadata"]["category"])

        print("Subcategory:")
        print(chunk["metadata"]["subcategory"])

        print("\nText:")
        print(chunk["text"][:500])

        print()