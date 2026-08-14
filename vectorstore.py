from loader import load_documents
from chunker import create_chunks

import chromadb
from sentence_transformers import SentenceTransformer


# -----------------------------
# Configuration
# -----------------------------

DB_PATH = "chroma_db"
COLLECTION_NAME = "telecom_knowledge_base"

EMBEDDING_MODEL = "all-MiniLM-L6-v2"


# -----------------------------
# Load embedding model
# -----------------------------

print("Loading embedding model...")

model = SentenceTransformer(EMBEDDING_MODEL)


# -----------------------------
# Create ChromaDB
# -----------------------------

client = chromadb.PersistentClient(
    path=DB_PATH
)

# Delete existing collection to avoid mixing old and new embeddings
try:
    client.delete_collection(name=COLLECTION_NAME)
    print(f"Deleted old collection '{COLLECTION_NAME}' to prevent mixing old and new embeddings.")
except Exception as e:
    print(f"No existing collection to delete or error: {e}")

collection = client.get_or_create_collection(
    name=COLLECTION_NAME
)


# -----------------------------
# Load documents
# -----------------------------

print("Loading knowledge base...")

documents = load_documents()

print(f"Documents loaded: {len(documents)}")


# -----------------------------
# Create chunks
# -----------------------------

chunks = create_chunks(documents)

print(f"Chunks created: {len(chunks)}")


# -----------------------------
# Prepare data
# -----------------------------

texts = []
ids = []
metadatas = []

for chunk in chunks:

    texts.append(chunk["text"])

    ids.append(
        chunk["metadata"]["chunk_id"]
    )

    metadata = chunk["metadata"].copy()

    # ChromaDB accepts simple metadata values
    metadata["source_basis"] = str(
        metadata["source_basis"]
    )

    metadatas.append(metadata)


# -----------------------------
# Generate embeddings
# -----------------------------

print("Generating embeddings...")

embeddings = model.encode(
    texts,
    show_progress_bar=True
).tolist()


# -----------------------------
# Store in ChromaDB
# -----------------------------

print("Storing embeddings...")

collection.upsert(
    ids=ids,
    documents=texts,
    metadatas=metadatas,
    embeddings=embeddings
)


# -----------------------------
# Result
# -----------------------------

print("\nVector database created successfully.")

print(f"Collection: {COLLECTION_NAME}")
print(f"Total chunks stored: {collection.count()}")
print(f"Database location: {DB_PATH}")