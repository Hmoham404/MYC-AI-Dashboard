import json
from pathlib import Path
from typing import Any, Dict, List

import numpy as np
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent.parent
ANALYSES_DIR = BASE_DIR / "data" / "analyses"
MAX_ANALYSIS_ROWS = 50_000

REPORT_TRANSLATIONS = {
    "fr": {
        "quality": "Score qualite",
        "overview": "Vue d'ensemble",
        "strengths": "Points forts",
        "recommendations": "Recommandations",
        "signal": "Signaux clefs",
        "source": "Analyse sur {rows} lignes",
        "missing_low": "Peu de valeurs manquantes",
        "duplicate_none": "Aucune ligne dupliquee",
        "typed": "Typage automatique complet",
        "clean": "Les donnees sont propres: passer a la segmentation metier",
        "missing_action": "Nettoyer ou imputer les valeurs manquantes les plus frequentes",
        "outliers": "Verifier les outliers sur {cols}",
        "corr": "Capitaliser sur la relation forte entre {c1} et {c2}",
        "file": "Fichier",
        "chart_bar": "Moyenne de {y} par {x}",
        "chart_line": "Tendance de {y} dans le temps",
        "chart_pie": "Distribution de {x}",
        "chart_scatter": "Relation entre {x} et {y}",
        "chart_hist": "Histogramme de {x}",
        "chart_heatmap": "Heatmap des corrélations",
    },
    "en": {
        "quality": "Quality score",
        "overview": "Overview",
        "strengths": "Strengths",
        "recommendations": "Recommendations",
        "signal": "Key signals",
        "source": "Analysis on {rows} rows",
        "missing_low": "Few missing values",
        "duplicate_none": "No duplicate rows",
        "typed": "Automatic typing complete",
        "clean": "The data looks clean: move to business segmentation",
        "missing_action": "Clean or impute the most frequent missing values",
        "outliers": "Check outliers in {cols}",
        "corr": "Leverage the strong relation between {c1} and {c2}",
        "file": "File",
        "chart_bar": "Average of {y} by {x}",
        "chart_line": "Trend of {y} over time",
        "chart_pie": "Distribution of {x}",
        "chart_scatter": "Relationship between {x} and {y}",
        "chart_hist": "Histogram of {x}",
        "chart_heatmap": "Correlation heatmap",
    },
    "it": {
        "quality": "Punteggio qualita",
        "overview": "Panoramica",
        "strengths": "Punti di forza",
        "recommendations": "Raccomandazioni",
        "signal": "Segnali chiave",
        "source": "Analisi su {rows} righe",
        "missing_low": "Pochi valori mancanti",
        "duplicate_none": "Nessuna riga duplicata",
        "typed": "Tipizzazione automatica completata",
        "clean": "I dati sono puliti: vai alla segmentazione di business",
        "missing_action": "Pulisci o imputa i valori mancanti piu frequenti",
        "outliers": "Controlla gli outlier in {cols}",
        "corr": "Sfrutta la forte relazione tra {c1} e {c2}",
        "file": "File",
        "chart_bar": "Media di {y} per {x}",
        "chart_line": "Andamento di {y} nel tempo",
        "chart_pie": "Distribuzione di {x}",
        "chart_scatter": "Relazione tra {x} e {y}",
        "chart_hist": "Istogramma di {x}",
        "chart_heatmap": "Heatmap delle correlazioni",
    },
    "zh": {
        "quality": "质量评分",
        "overview": "概览",
        "strengths": "优势",
        "recommendations": "建议",
        "signal": "关键指标",
        "source": "基于 {rows} 行数据分析",
        "missing_low": "缺失值较少",
        "duplicate_none": "没有重复行",
        "typed": "自动类型识别完成",
        "clean": "数据较干净，可进入业务分群",
        "missing_action": "清理或插补最常见的缺失值",
        "outliers": "检查 {cols} 的异常值",
        "corr": "利用 {c1} 与 {c2} 之间的强相关关系",
        "file": "文件",
        "chart_bar": "{x} 下 {y} 的平均值",
        "chart_line": "{y} 的时间趋势",
        "chart_pie": "{x} 的分布",
        "chart_scatter": "{x} 与 {y} 的关系",
        "chart_hist": "{x} 的直方图",
        "chart_heatmap": "相关性热力图",
    },
}


def tr(language: str, key: str, **kwargs: Any) -> str:
    lang = language if language in REPORT_TRANSLATIONS else "fr"
    template = REPORT_TRANSLATIONS[lang].get(key, REPORT_TRANSLATIONS["fr"].get(key, key))
    return template.format(**kwargs)


def localize_chart_title(chart: Dict[str, Any], language: str) -> Dict[str, Any]:
    translated = dict(chart)
    x = chart.get("x", "")
    y = chart.get("y", "")
    chart_type = chart.get("type")

    if chart_type == "bar":
        translated["title"] = tr(language, "chart_bar", x=x, y=y)
    elif chart_type == "line":
        translated["title"] = tr(language, "chart_line", x=x, y=y)
    elif chart_type == "pie":
        translated["title"] = tr(language, "chart_pie", x=x)
    elif chart_type == "scatter":
        translated["title"] = tr(language, "chart_scatter", x=x, y=y)
    elif chart_type == "histogram":
        translated["title"] = tr(language, "chart_hist", x=x)
    elif chart_type == "heatmap":
        translated["title"] = tr(language, "chart_heatmap")

    return translated


def localize_analysis(analysis: Dict[str, Any], language: str, file_name: str | None = None) -> Dict[str, Any]:
    localized = dict(analysis)
    summary = analysis.get("summary", {})
    report = dict(analysis.get("report", {}))
    strengths = list(report.get("strengths", []))
    recommendations = list(report.get("recommendations", []))

    if language in REPORT_TRANSLATIONS:
        source_rows = min(int(summary.get("total_rows", 0)), MAX_ANALYSIS_ROWS)
        report["quality_label"] = tr(language, "quality")
        report["overview_label"] = tr(language, "overview")
        report["strengths_label"] = tr(language, "strengths")
        report["recommendations_label"] = tr(language, "recommendations")
        report["signal_label"] = tr(language, "signal")
        report["source_hint"] = tr(language, "source", rows=source_rows)

        if not strengths:
            strengths = [tr(language, "typed")]
        if not recommendations:
            recommendations = [tr(language, "clean")]

        report["strengths"] = strengths
        report["recommendations"] = recommendations

    localized["report"] = report
    localized["chart_suggestions"] = [localize_chart_title(chart, language) for chart in analysis.get("chart_suggestions", [])]
    if file_name:
        localized["filename"] = file_name
    return localized


def _to_native(value: Any) -> Any:
    if isinstance(value, (np.integer,)):
        return int(value)
    if isinstance(value, (np.floating,)):
        if np.isnan(value):
            return None
        return float(value)
    if isinstance(value, (pd.Timestamp,)):
        return value.isoformat()
    if pd.isna(value):
        return None
    return value


def infer_column_types(df: pd.DataFrame) -> Dict[str, str]:
    types: Dict[str, str] = {}

    for col in df.columns:
        series = df[col]
        if pd.api.types.is_numeric_dtype(series):
            types[col] = "numeric"
            continue

        if pd.api.types.is_datetime64_any_dtype(series):
            types[col] = "date"
            continue

        non_null = series.dropna()
        if non_null.empty:
            types[col] = "text"
            continue

        sample = non_null.astype(str).head(1000)
        parsed_dates = pd.to_datetime(sample, errors="coerce")
        date_ratio = parsed_dates.notna().mean() if len(sample) else 0
        unique_ratio = non_null.nunique() / max(len(non_null), 1)

        if date_ratio >= 0.8:
            types[col] = "date"
        elif non_null.nunique() <= 30 or unique_ratio < 0.2:
            types[col] = "categorical"
        else:
            types[col] = "text"

    return types


def compute_descriptive_stats(df: pd.DataFrame) -> Dict[str, Any]:
    numeric_df = df.select_dtypes(include=["number"])
    if numeric_df.empty:
        return {}

    stats: Dict[str, Any] = {}
    for col in numeric_df.columns:
        series = numeric_df[col].dropna()
        if series.empty:
            continue

        mean = series.mean()
        std = series.std()
        cv = (std / abs(mean) * 100) if mean != 0 else 0  # Coefficient of variation
        
        stats[col] = {
            "count": int(series.count()),
            "mean": _to_native(mean),
            "median": _to_native(series.median()),
            "std": _to_native(std),
            "variance": _to_native(series.var()),
            "cv": round(float(cv), 2),  # Coefficient of variation in %
            "min": _to_native(series.min()),
            "q1": _to_native(series.quantile(0.25)),
            "q3": _to_native(series.quantile(0.75)),
            "max": _to_native(series.max()),
            "range": _to_native(series.max() - series.min()),
            "iqr": _to_native(series.quantile(0.75) - series.quantile(0.25)),
            "skewness": _to_native(series.skew()),  # Distribution asymmetry
            "kurtosis": _to_native(series.kurtosis()),  # Distribution tail weight
            "entropy": round(float(_calculate_entropy(series)), 3),  # Information entropy
        }

    return stats


def _calculate_entropy(series: pd.Series) -> float:
    """Calculate Shannon entropy of a distribution."""
    if len(series) == 0:
        return 0.0
    # Use histogram binning for continuous data
    bins = min(len(series) // 10, 50)  # Adaptive bins
    if bins < 2:
        bins = 2
    try:
        counts, _ = np.histogram(series.dropna(), bins=bins)
        # Avoid log(0)
        counts = counts[counts > 0]
        if len(counts) == 0:
            return 0.0
        probabilities = counts / counts.sum()
        return float(-np.sum(probabilities * np.log2(probabilities + 1e-10)))
    except Exception:
        return 0.0


def compute_missing_values(df: pd.DataFrame) -> Dict[str, Any]:
    missing_count = df.isna().sum()
    missing_pct = (missing_count / max(len(df), 1) * 100).round(2)

    return {
        "total_missing_cells": int(missing_count.sum()),
        "per_column": {
            col: {
                "count": int(missing_count[col]),
                "percentage": float(missing_pct[col]),
            }
            for col in df.columns
        },
    }


def compute_outliers(df: pd.DataFrame) -> Dict[str, Any]:
    numeric_df = df.select_dtypes(include=["number"])
    outliers: Dict[str, Any] = {}

    for col in numeric_df.columns:
        series = numeric_df[col].dropna()
        if series.empty:
            continue

        q1 = series.quantile(0.25)
        q3 = series.quantile(0.75)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        count = int(((series < lower) | (series > upper)).sum())

        outliers[col] = {
            "count": count,
            "lower_bound": _to_native(lower),
            "upper_bound": _to_native(upper),
        }

    return outliers


def compute_correlations(df: pd.DataFrame) -> Dict[str, Any]:
    numeric_df = df.select_dtypes(include=["number"])
    if numeric_df.shape[1] < 2:
        return {"matrix": {}, "top_pairs": []}

    corr = numeric_df.corr(numeric_only=True)
    pairs: List[Dict[str, Any]] = []
    cols = list(corr.columns)

    for i, c1 in enumerate(cols):
        for c2 in cols[i + 1 :]:
            value = corr.loc[c1, c2]
            if pd.notna(value):
                pairs.append({"col1": c1, "col2": c2, "correlation": float(value)})

    top_pairs = sorted(pairs, key=lambda x: abs(x["correlation"]), reverse=True)[:10]

    matrix = {
        row: {col: _to_native(corr.loc[row, col]) for col in corr.columns}
        for row in corr.index
    }

    return {"matrix": matrix, "top_pairs": top_pairs}


def build_kpis(df: pd.DataFrame, column_types: Dict[str, str], missing_info: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "total_rows": int(df.shape[0]),
        "total_columns": int(df.shape[1]),
        "missing_values": int(missing_info["total_missing_cells"]),
        "duplicate_rows": int(df.duplicated().sum()),
        "numeric_columns": int(sum(1 for t in column_types.values() if t == "numeric")),
        "categorical_columns": int(sum(1 for t in column_types.values() if t == "categorical")),
        "date_columns": int(sum(1 for t in column_types.values() if t == "date")),
        "text_columns": int(sum(1 for t in column_types.values() if t == "text")),
    }


def build_report(df: pd.DataFrame, summary: Dict[str, Any], column_types: Dict[str, str], missing_info: Dict[str, Any], outliers: Dict[str, Any], correlations: Dict[str, Any]) -> Dict[str, Any]:
    total_cells = max(int(df.shape[0] * df.shape[1]), 1)
    missing_ratio = float(summary.get("missing_values", 0)) / total_cells
    duplicate_ratio = float(summary.get("duplicate_rows", 0)) / max(int(summary.get("total_rows", 1)), 1)
    outlier_columns = [col for col, info in outliers.items() if info.get("count", 0) > 0]
    top_corr = correlations.get("top_pairs", [])[:3]

    quality_score = 100
    quality_score -= min(int(missing_ratio * 1000), 35)
    quality_score -= min(int(duplicate_ratio * 1000), 20)
    quality_score -= min(len(outlier_columns) * 2, 15)
    quality_score = max(quality_score, 0)

    strengths = []
    if missing_ratio < 0.02:
        strengths.append(REPORT_TRANSLATIONS["fr"]["missing_low"])
    if summary.get("duplicate_rows", 0) == 0:
        strengths.append(REPORT_TRANSLATIONS["fr"]["duplicate_none"])
    if len(column_types) > 0:
        strengths.append(REPORT_TRANSLATIONS["fr"]["typed"])

    recommendations = []
    if missing_ratio >= 0.02:
        recommendations.append(REPORT_TRANSLATIONS["fr"]["missing_action"])
    if outlier_columns:
        recommendations.append(REPORT_TRANSLATIONS["fr"]["outliers"].format(cols=', '.join(outlier_columns[:4])))
    if top_corr:
        best = top_corr[0]
        recommendations.append(REPORT_TRANSLATIONS["fr"]["corr"].format(c1=best['col1'], c2=best['col2']))
    if not recommendations:
        recommendations.append(REPORT_TRANSLATIONS["fr"]["clean"])

    overview = (
        f"{summary.get('total_rows', 0)} lignes, {summary.get('total_columns', 0)} colonnes, "
        f"{summary.get('missing_values', 0)} valeurs manquantes et {summary.get('duplicate_rows', 0)} doublons."
    )

    return {
        "quality_score": quality_score,
        "quality_label": REPORT_TRANSLATIONS["fr"]["quality"],
        "overview_label": REPORT_TRANSLATIONS["fr"]["overview"],
        "strengths_label": REPORT_TRANSLATIONS["fr"]["strengths"],
        "recommendations_label": REPORT_TRANSLATIONS["fr"]["recommendations"],
        "overview": overview,
        "strengths": strengths[:4],
        "recommendations": recommendations[:4],
        "key_signals": {
            "missing_ratio": round(missing_ratio * 100, 2),
            "duplicate_ratio": round(duplicate_ratio * 100, 2),
            "outlier_columns": outlier_columns[:10],
        },
        "top_correlations": top_corr,
        "source_hint": REPORT_TRANSLATIONS["fr"]["source"].format(rows=min(len(df), MAX_ANALYSIS_ROWS)),
    }


def _series_to_chart_points(series: pd.Series, key_name: str = "value", top_n: int = 30) -> List[Dict[str, Any]]:
    series = series.head(top_n)
    return [{"name": str(idx), key_name: _to_native(val)} for idx, val in series.items()]


def suggest_charts(df: pd.DataFrame, column_types: Dict[str, str], correlations: Dict[str, Any]) -> List[Dict[str, Any]]:
    charts: List[Dict[str, Any]] = []
    numeric_cols = [c for c, t in column_types.items() if t == "numeric"]
    categorical_cols = [c for c, t in column_types.items() if t == "categorical"]
    date_cols = [c for c, t in column_types.items() if t == "date"]

    if categorical_cols and numeric_cols:
        cat_col = categorical_cols[0]
        num_col = numeric_cols[0]
        grouped = df.groupby(cat_col, dropna=False)[num_col].mean().sort_values(ascending=False)
        charts.append(
            {
                "id": f"bar_{cat_col}_{num_col}",
                "type": "bar",
                "title": f"Moyenne de {num_col} par {cat_col}",
                "x": cat_col,
                "y": num_col,
                "data": _series_to_chart_points(grouped, key_name="value", top_n=20),
            }
        )

    if date_cols and numeric_cols:
        date_col = date_cols[0]
        num_col = numeric_cols[0]
        temp = df[[date_col, num_col]].copy()
        temp[date_col] = pd.to_datetime(temp[date_col], errors="coerce")
        trend = temp.dropna().sort_values(date_col).groupby(date_col)[num_col].mean().tail(300)
        charts.append(
            {
                "id": f"line_{date_col}_{num_col}",
                "type": "line",
                "title": f"Tendance de {num_col} dans le temps",
                "x": date_col,
                "y": num_col,
                "data": [
                    {"name": str(idx.date() if hasattr(idx, "date") else idx), "value": _to_native(v)}
                    for idx, v in trend.items()
                ],
            }
        )

    if categorical_cols:
        cat_col = categorical_cols[0]
        pie_data = df[cat_col].astype(str).value_counts(dropna=False).head(12)
        charts.append(
            {
                "id": f"pie_{cat_col}",
                "type": "pie",
                "title": f"Distribution de {cat_col}",
                "label": cat_col,
                "data": _series_to_chart_points(pie_data, key_name="value", top_n=12),
            }
        )

    if len(numeric_cols) >= 2:
        c1, c2 = numeric_cols[:2]
        sample = df[[c1, c2]].dropna().head(2000)
        charts.append(
            {
                "id": f"scatter_{c1}_{c2}",
                "type": "scatter",
                "title": f"Relation entre {c1} et {c2}",
                "x": c1,
                "y": c2,
                "data": [{c1: _to_native(r[c1]), c2: _to_native(r[c2])} for _, r in sample.iterrows()],
            }
        )

    if numeric_cols:
        for col in numeric_cols[:3]:
            hist_series = df[col].dropna()
            if hist_series.empty:
                continue

            bins = np.histogram(hist_series, bins=20)
            hist_data = [
                {
                    "name": f"{round(float(bins[1][i]), 2)} - {round(float(bins[1][i + 1]), 2)}",
                    "value": int(bins[0][i]),
                }
                for i in range(len(bins[0]))
            ]
            charts.append(
                {
                    "id": f"hist_{col}",
                    "type": "histogram",
                    "title": f"Histogramme de {col}",
                    "x": col,
                    "y": "count",
                    "data": hist_data,
                }
            )

    corr_matrix = correlations.get("matrix", {})
    if corr_matrix:
        heatmap_data = []
        for row_name, row_values in corr_matrix.items():
            for col_name, value in row_values.items():
                heatmap_data.append({"x": row_name, "y": col_name, "value": value})

        charts.append(
            {
                "id": "heatmap_correlations",
                "type": "heatmap",
                "title": "Heatmap des corrélations",
                "data": heatmap_data,
            }
        )

    return charts


def run_full_analysis(df: pd.DataFrame) -> Dict[str, Any]:
    if df.empty:
        raise ValueError("Le fichier est vide.")

    if df.columns.empty:
        raise ValueError("Le fichier ne contient aucune colonne exploitable.")

    # Sample very large datasets for heavy stats to keep response time predictable.
    analysis_df = df if len(df) <= MAX_ANALYSIS_ROWS else df.sample(MAX_ANALYSIS_ROWS, random_state=42)

    column_types = infer_column_types(analysis_df)
    missing_values = compute_missing_values(df)
    descriptive_stats = compute_descriptive_stats(analysis_df)
    outliers = compute_outliers(analysis_df)
    correlations = compute_correlations(analysis_df)
    chart_suggestions = suggest_charts(analysis_df, column_types, correlations)
    summary = build_kpis(df, column_types, missing_values)
    report = build_report(df, summary, column_types, missing_values, outliers, correlations)
    preview_df = df.head(300).copy()
    preview_df = preview_df.replace({np.nan: None})

    preview_rows = []
    for _, row in preview_df.iterrows():
        preview_rows.append({col: _to_native(row[col]) for col in preview_df.columns})

    return {
        "summary": summary,
        "columns": [str(col) for col in df.columns],
        "column_types": column_types,
        "descriptive_stats": descriptive_stats,
        "missing_values": missing_values,
        "outliers": outliers,
        "correlations": correlations,
        "report": report,
        "chart_suggestions": chart_suggestions,
        "data_preview": preview_rows,
    }


def save_analysis(file_id: str, analysis: Dict[str, Any]) -> Path:
    ANALYSES_DIR.mkdir(parents=True, exist_ok=True)
    path = ANALYSES_DIR / f"{file_id}.json"
    path.write_text(json.dumps(analysis, ensure_ascii=False, indent=2), encoding="utf-8")
    return path


def load_analysis(file_id: str) -> Dict[str, Any]:
    path = ANALYSES_DIR / f"{file_id}.json"
    if not path.exists():
        raise FileNotFoundError(f"Aucune analyse trouvée pour {file_id}")
    return json.loads(path.read_text(encoding="utf-8"))
