from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class UploadResponse(BaseModel):
    file_id: str
    filename: str
    message: str


class AnalyzeRequest(BaseModel):
    file_id: str = Field(..., description="Identifiant du fichier uploadé")


class AnalysisResponse(BaseModel):
    file_id: str
    filename: str
    summary: Dict[str, Any]
    columns: List[str]
    column_types: Dict[str, str]
    descriptive_stats: Dict[str, Any]
    missing_values: Dict[str, Any]
    outliers: Dict[str, Any]
    correlations: Dict[str, Any]
    report: Dict[str, Any]
    chart_suggestions: List[Dict[str, Any]]
    data_preview: List[Dict[str, Any]]
    ai_insights: List[str]


class ChartsResponse(BaseModel):
    file_id: str
    charts: List[Dict[str, Any]]


class ErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
