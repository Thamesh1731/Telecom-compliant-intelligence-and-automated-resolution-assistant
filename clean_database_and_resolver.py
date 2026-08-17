"""
clean_database_and_resolver.py
==============================
Utility script to completely clean and reset:
1. AWS RDS MySQL database tables (complaints, escalated_tickets, negative_feedback, technician_resolutions).
2. Local resolver_base Markdown and JSON files (category folders, pending/, resolved/).
3. ChromaDB resolver_base_solutions collection.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import sqlalchemy
from sqlalchemy import text
import chromadb

# Load environment variables
_PROJECT_ROOT = Path(__file__).resolve().parent
load_dotenv(_PROJECT_ROOT / ".env")

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./telecom_data.db").strip()


def clean_database():
    """Wipes all rows from the 4 application database tables."""
    print(f"\n=======================================================")
    print(f" 🧹 1. Cleaning Database: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
    print(f"=======================================================")

    try:
        connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {"connect_timeout": 10}
        engine = sqlalchemy.create_engine(DATABASE_URL, connect_args=connect_args)

        with engine.begin() as conn:
            # Disable foreign key checks for safe truncation/deletion
            if not DATABASE_URL.startswith("sqlite"):
                conn.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))

            tables = ["complaints", "escalated_tickets", "negative_feedback", "technician_resolutions"]
            for table in tables:
                try:
                    if DATABASE_URL.startswith("sqlite"):
                        conn.execute(text(f"DELETE FROM {table};"))
                    else:
                        conn.execute(text(f"TRUNCATE TABLE {table};"))
                    print(f"  ✅ Cleared table: {table}")
                except Exception as tbl_err:
                    # Fallback to DELETE if TRUNCATE fails
                    try:
                        conn.execute(text(f"DELETE FROM {table};"))
                        print(f"  ✅ Deleted rows from table: {table}")
                    except Exception as del_err:
                        print(f"  ⚠️ Could not clear table {table}: {del_err}")

            if not DATABASE_URL.startswith("sqlite"):
                conn.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))

        print("  🎉 Database tables successfully cleaned!")

    except Exception as exc:
        print(f"  ❌ Database connection/cleaning error: {exc}")


def clean_resolver_base_files():
    """Deletes all solution markdown and json files from resolver_base while keeping directories."""
    print(f"\n=======================================================")
    print(f" 🧹 2. Cleaning resolver_base Files")
    print(f"=======================================================")

    resolver_root = _PROJECT_ROOT / "resolver_base"
    if not resolver_root.exists():
        print(f"  ℹ️ resolver_base folder not found at: {resolver_root}")
        return

    deleted_count = 0
    for root_dir, dirs, files in os.walk(resolver_root):
        for file in files:
            # Only delete markdown and json data files (keep .gitkeep if any)
            if file.endswith((".md", ".json")) and not file.startswith("."):
                file_path = Path(root_dir) / file
                try:
                    file_path.unlink()
                    deleted_count += 1
                    rel_path = file_path.relative_to(resolver_root)
                    print(f"  🗑️ Removed file: {rel_path}")
                except Exception as e:
                    print(f"  ⚠️ Failed to delete {file_path}: {e}")

    print(f"  ✅ Cleaned {deleted_count} files from resolver_base subdirectories.")


def clean_chroma_resolver_collection():
    """Resets the ChromaDB resolver_base_solutions collection."""
    print(f"\n=======================================================")
    print(f" 🧹 3. Resetting ChromaDB Resolver Collection")
    print(f"=======================================================")

    chroma_path = _PROJECT_ROOT / "chroma_db"
    try:
        client = chromadb.PersistentClient(path=str(chroma_path))
        try:
            client.delete_collection("resolver_base_solutions")
            print("  🗑️ Deleted ChromaDB collection: resolver_base_solutions")
        except Exception:
            pass

        client.create_collection("resolver_base_solutions", metadata={"hnsw:space": "cosine"})
        print("  ✅ Created fresh empty ChromaDB collection: resolver_base_solutions")

    except Exception as exc:
        print(f"  ⚠️ ChromaDB reset note: {exc}")


def main():
    print("\n🚀 Starting Full Cleanup for Database & Resolver Base...")
    clean_database()
    clean_resolver_base_files()
    clean_chroma_resolver_collection()
    print("\n✨ All operations complete! Database and Resolver Base are clean.\n")


if __name__ == "__main__":
    main()
