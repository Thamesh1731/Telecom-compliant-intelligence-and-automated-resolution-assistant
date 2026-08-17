"""
view_db.py — CLI Database Inspector for SignalCX Telecom Assistant.
Connects to AWS RDS MySQL (or SQLite) and displays all tables formatted.
"""

import os
from pathlib import Path
from dotenv import load_dotenv
import sqlalchemy
import pandas as pd

_ENV_FILE = Path(__file__).parent / ".env"
load_dotenv(_ENV_FILE)

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./telecom_data.db").strip()

def main():
    print(f"\n=======================================================")
    print(f" Connecting to Database: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")
    print(f"=======================================================\n")

    try:
        connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {"connect_timeout": 10}
        engine = sqlalchemy.create_engine(DATABASE_URL, connect_args=connect_args)
        inspector = sqlalchemy.inspect(engine)
        tables = inspector.get_table_names()

        if not tables:
            print("No tables found in the database.")
            return

        for table in ["complaints", "escalated_tickets", "negative_feedback", "technician_resolutions"]:
            if table in tables:
                print(f"-------------------------------------------------------")
                print(f" TABLE: {table.upper()}")
                print(f"-------------------------------------------------------")
                df = pd.read_sql_table(table, engine)
                if df.empty:
                    print("(0 records)\n")
                else:
                    print(f"Total Rows: {len(df)}")
                    print(df.tail(10).to_string(index=False))
                    print("\n")

    except Exception as exc:
        print(f"[Error] Failed to connect to database: {exc}")

if __name__ == "__main__":
    main()
