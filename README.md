# Telecom Complaint Intelligence & Automated Resolution Assistant (CTS Hackathon)

This project implements a **Hierarchical Retrieval-Augmented Generation (RAG) Retrieval Pipeline** for telecom complaint intelligence and resolution. It reads knowledge base documents, groups them, finds the most relevant document, identifies the specific issue, and retrieves the most useful actionable sections (Troubleshooting, Resolution, Escalations) while avoiding fragmented or cross-document mixed contexts.

---

## Project Structure

* **`knowledge_base/`**: Hierarchical Markdown articles organized by category containing troubleshooting procedures, problems, symptoms, and resolution policies.
* **`complaint_classifier_final.joblib`**: A trained classification model used as a soft supporting signal.
* **`category_mapper.py`**: Maps predicted classifier labels to database metadata categories.
* **`loader.py`**: Loads files from the knowledge base, extracts document titles, and sets subcategory fallbacks.
* **`chunker.py`**: Filters out generic noise sections and chunks document text with parent context headers.
* **`vectorstore.py`**: Initializes ChromaDB, deletes old collections to prevent embedding mixing, and generates sentence embeddings for storage.
* **`retriever.py`**: Core hierarchical retrieval pipeline featuring:
  * **Level 1**: Document Scoring (semantic, subcategory, intent, and category soft compatibilities).
  * **Level 2**: Ambiguity Detection (evaluates score differences to detect ambiguous queries).
  * **Level 3**: Associated Section Retrieval (fetches all sections of selected documents and applies MMR-based section diversification).
* **`eval_retrieval.py`**: Test suite containing 29 representative complaints to evaluate Recall metrics and Actionable Section Retrieval Rate.

---

## Setup & Installation

Follow these steps to set up and run this project on a different laptop:

### 1. Prerequisites
Ensure you have **Python 3.10 to 3.12** installed on your system.

### 2. Create a Virtual Environment
Navigate to the project root directory and create a virtual environment:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows (Command Prompt):
venv\Scripts\activate
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies
Install all required packages from `requirements.txt`:

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

## How to Run

### Step 1: Rebuild the Vector Database
Before running search queries, you must populate the vector database with the context-enriched document chunks. Run the database builder:

```bash
python vectorstore.py
```
*This will delete any old collections (if present), read all knowledge base articles, chunk them with parent document metadata, generate sentence embeddings using `sentence-transformers/all-MiniLM-L6-v2`, and save them under `chroma_db/`.*

### Step 2: Run Retriever Interactively
To test individual customer complaints and view retrieved knowledge blocks along with debug scores, run:

```bash
python retriever.py
```
You will be prompted to enter a complaint (e.g. *"my number isn't working after porting"* or *"Calls keep dropping after five minutes"*). The terminal will display:
- Classifier predictions
- Mapped calling intents
- Selected documents (and ambiguity status)
- Detailed scores (semantic, subcategory, intent, and category compatibilities)
- Final selected sections

### Step 3: Run the Evaluation Suite
To execute the automated recall and actionable knowledge evaluation on the 29 test suite complaints:

```bash
python eval_retrieval.py
```
This prints the mapped categories, selected documents, and whether they passed the Recall@1, Recall@3, Recall@5, and Actionable Section metrics, followed by summary percentages.
