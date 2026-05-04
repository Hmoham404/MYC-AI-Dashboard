import sqlite3
from pathlib import Path
from typing import Any, Dict, Optional

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "history.db"


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with _connect() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS files (
                id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                filepath TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                uploaded_at TEXT NOT NULL,
                status TEXT NOT NULL,
                row_count INTEGER,
                column_count INTEGER,
                error_message TEXT
            )
            """
        )
        conn.commit()


def add_file_record(record: Dict[str, Any]) -> None:
    with _connect() as conn:
        conn.execute(
            """
            INSERT INTO files (
                id, filename, filepath, file_size, uploaded_at, status
            ) VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                record["id"],
                record["filename"],
                record["filepath"],
                record["file_size"],
                record["uploaded_at"],
                record["status"],
            ),
        )
        conn.commit()


def update_file_status(
    file_id: str,
    status: str,
    row_count: Optional[int] = None,
    column_count: Optional[int] = None,
    error_message: Optional[str] = None,
) -> None:
    with _connect() as conn:
        conn.execute(
            """
            UPDATE files
            SET status = ?,
                row_count = COALESCE(?, row_count),
                column_count = COALESCE(?, column_count),
                error_message = COALESCE(?, error_message)
            WHERE id = ?
            """,
            (status, row_count, column_count, error_message, file_id),
        )
        conn.commit()


def get_file_record(file_id: str) -> Optional[Dict[str, Any]]:
    with _connect() as conn:
        row = conn.execute("SELECT * FROM files WHERE id = ?", (file_id,)).fetchone()
        return dict(row) if row else None
