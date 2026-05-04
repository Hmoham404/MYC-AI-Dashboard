import os
import re
from pathlib import Path
from typing import Tuple

import pandas as pd
from fastapi import HTTPException, UploadFile

BASE_DIR = Path(__file__).resolve().parent.parent
UPLOAD_DIR = BASE_DIR / "data" / "uploads"
MAX_FILE_SIZE = 25 * 1024 * 1024
ALLOWED_EXTENSIONS = {".csv", ".xlsx", ".xls"}


def sanitize_filename(filename: str) -> str:
    return re.sub(r"[^a-zA-Z0-9._-]", "_", filename)


async def validate_upload_file(file: UploadFile) -> Tuple[str, int]:
    if not file.filename:
        raise HTTPException(status_code=400, detail="Nom de fichier invalide.")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Format non supporté. Utilisez CSV/XLS/XLSX.")

    # UploadFile.seek does not support whence; use the underlying file object.
    file.file.seek(0, os.SEEK_END)
    size = file.file.tell()
    file.file.seek(0)

    if size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="Fichier trop volumineux (max 25MB).")

    return ext, size


async def save_upload_file(file: UploadFile, destination: Path) -> None:
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    with destination.open("wb") as buffer:
        while True:
            chunk = await file.read(1024 * 1024)
            if not chunk:
                break
            buffer.write(chunk)
    await file.close()


def load_dataframe(file_path: str) -> pd.DataFrame:
    path = Path(file_path)
    ext = path.suffix.lower()
    try:
        if ext == ".csv":
            # low_memory=False improves dtype consistency on large mixed files.
            return pd.read_csv(path, low_memory=False)
        if ext in {".xlsx", ".xls"}:
            return pd.read_excel(path)
        raise ValueError("Extension non supportée")
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Impossible de lire le fichier: {exc}") from exc
