from fastapi import APIRouter, HTTPException, Query

from models.schemas import AnalysisResponse, AnalyzeRequest
from services.ai_insights import generate_ai_insights
from services.analyzer import build_report, load_analysis, localize_analysis, run_full_analysis, save_analysis
from services.db import get_file_record, update_file_status
from services.file_parser import load_dataframe

router = APIRouter(tags=["analyze"])


@router.post("/analyze", response_model=AnalysisResponse)
def analyze_file(payload: AnalyzeRequest, language: str = Query(default="fr")) -> AnalysisResponse:
    return analyze_file_with_key(payload, language=language)


def analyze_file_with_key(
    payload: AnalyzeRequest,
    language: str = "fr",
    openai_api_key: str | None = None,
) -> AnalysisResponse:
    record = get_file_record(payload.file_id)
    if not record:
        raise HTTPException(status_code=404, detail="Fichier introuvable.")

    try:
        # Fast path: if analysis already exists, return it immediately.
        if record.get("status") == "analyzed":
            try:
                cached = load_analysis(payload.file_id)
                if "report" not in cached:
                    df = load_dataframe(record["filepath"])
                    cached["report"] = build_report(
                        df,
                        cached["summary"],
                        cached["column_types"],
                        cached["missing_values"],
                        cached["outliers"],
                        cached["correlations"],
                    )
                    save_analysis(payload.file_id, cached)
                localized = localize_analysis(cached, language=language, file_name=record.get("filename"))
                localized["ai_insights"] = generate_ai_insights(localized, openai_api_key=openai_api_key, language=language)
                return AnalysisResponse(file_id=payload.file_id, **localized)
            except FileNotFoundError:
                pass

        update_file_status(payload.file_id, "analyzing")
        df = load_dataframe(record["filepath"])

        analysis = run_full_analysis(df)
        analysis = localize_analysis(analysis, language=language, file_name=record.get("filename"))
        analysis["ai_insights"] = generate_ai_insights(analysis, openai_api_key=openai_api_key, language=language)

        save_analysis(payload.file_id, analysis)

        update_file_status(
            payload.file_id,
            status="analyzed",
            row_count=df.shape[0],
            column_count=df.shape[1],
        )
        return AnalysisResponse(file_id=payload.file_id, **analysis)
    except HTTPException:
        raise
    except ValueError as exc:
        update_file_status(payload.file_id, status="failed", error_message=str(exc))
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        update_file_status(payload.file_id, status="failed", error_message=str(exc))
        raise HTTPException(status_code=500, detail=f"Erreur d'analyse: {exc}") from exc


