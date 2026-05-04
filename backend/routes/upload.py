from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

from models.schemas import UploadResponse
from services.db import add_file_record
from services.file_parser import save_upload_file, sanitize_filename, validate_upload_file

router = APIRouter(tags=["upload"])


@router.post("/upload", response_model=UploadResponse)
async def upload_file(file: UploadFile = File(...)) -> UploadResponse:
    ext, size = await validate_upload_file(file)

    file_id = str(uuid4())
    safe_name = sanitize_filename(file.filename)
    stored_name = f"{file_id}_{safe_name}"
    destination = Path(__file__).resolve().parent.parent / "data" / "uploads" / stored_name

    try:
        await save_upload_file(file, destination)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Échec de sauvegarde du fichier: {exc}") from exc

    add_file_record(
        {
            "id": file_id,
            "filename": file.filename,
            "filepath": str(destination),
            "file_size": size,
            "uploaded_at": datetime.now(timezone.utc).isoformat(),
            "status": "uploaded",
        }
    )

    return UploadResponse(
        file_id=file_id,
        filename=file.filename,
        message=f"Fichier uploadé avec succès ({ext}).",
    )
