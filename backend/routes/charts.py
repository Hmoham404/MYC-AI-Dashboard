from pathlib import Path
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import FileResponse

from models.schemas import ChartsResponse
from services.analyzer import load_analysis, localize_analysis
from services.db import get_file_record
from services.exporter import export_dashboard_pdf, export_dashboard_png

router = APIRouter(tags=["charts"])


@router.get("/charts/{file_id}", response_model=ChartsResponse)
def get_charts(
    file_id: str,
    language: str = Query(default="fr"),
    column: Optional[str] = Query(default=None, description="Filtrer les graphiques par colonne"),
    chart_types: Optional[List[str]] = Query(default=None, description="Filtrer par types de graphiques"),
) -> ChartsResponse:
    record = get_file_record(file_id)
    if not record:
        raise HTTPException(status_code=404, detail="Fichier introuvable.")

    try:
        analysis = load_analysis(file_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Analyse non trouvée. Lancez /analyze d'abord.") from exc

    charts = localize_analysis(analysis, language=language).get("chart_suggestions", [])

    if column:
        charts = [
            c
            for c in charts
            if c.get("x") == column or c.get("y") == column or c.get("label") == column
        ]

    if chart_types:
        allowed = {item.lower() for item in chart_types}
        charts = [c for c in charts if c.get("type", "").lower() in allowed]

    return ChartsResponse(file_id=file_id, charts=charts)


@router.get("/export/{file_id}")
def export_dashboard(
    file_id: str,
    format: str = Query(default="png", pattern="^(png|pdf)$"),
    language: str = Query(default="fr"),
) -> FileResponse:
    record = get_file_record(file_id)
    if not record:
        raise HTTPException(status_code=404, detail="Fichier introuvable.")

    try:
        analysis = load_analysis(file_id)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail="Analyse non trouvée. Lancez /analyze d'abord.") from exc

    analysis = localize_analysis(analysis, language=language, file_name=record.get("filename"))

    try:
        if format == "pdf":
            out_path = export_dashboard_pdf(file_id, analysis)
            media_type = "application/pdf"
        else:
            out_path = export_dashboard_png(file_id, analysis)
            media_type = "image/png"

        return FileResponse(
            path=Path(out_path),
            media_type=media_type,
            filename=f"dashboard_{file_id}.{format}",
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Erreur export {format}: {exc}") from exc
