import os
from typing import Any, Dict, List


LANGUAGE_NAMES = {
    "fr": "français",
    "en": "english",
    "it": "italiano",
    "zh": "中文",
}


def _language_label(language: str) -> str:
    return LANGUAGE_NAMES.get(language, "français")


def _heuristic_insights(analysis: Dict[str, Any], language: str = "fr") -> List[str]:
    insights: List[str] = []

    label_map = {
        "fr": {
            "dataset": "Le dataset contient {rows} lignes et {cols} colonnes.",
            "missing": "{count} valeurs manquantes détectées: une stratégie d'imputation est recommandée.",
            "complete": "Aucune valeur manquante détectée: la qualité de complétude est excellente.",
            "corr": "Corrélation la plus marquée: {c1} vs {c2} (r={r:.2f}).",
            "outliers": "Présence d'outliers sur les colonnes suivantes: {cols}.",
            "duplicate": "{count} lignes dupliquées trouvées: envisager une déduplication.",
            "fallback": "Les distributions sont globalement stables; vérifier la segmentation métier pour affiner.",
        },
        "en": {
            "dataset": "The dataset contains {rows} rows and {cols} columns.",
            "missing": "{count} missing values detected: imputation is recommended.",
            "complete": "No missing values detected: completeness looks excellent.",
            "corr": "Strongest correlation: {c1} vs {c2} (r={r:.2f}).",
            "outliers": "Outliers detected in the following columns: {cols}.",
            "duplicate": "{count} duplicate rows found: consider deduplication.",
            "fallback": "Distributions look stable overall; check business segmentation for deeper insights.",
        },
        "it": {
            "dataset": "Il dataset contiene {rows} righe e {cols} colonne.",
            "missing": "Rilevati {count} valori mancanti: si consiglia l'imputazione.",
            "complete": "Nessun valore mancante rilevato: la completezza e' eccellente.",
            "corr": "Correlazione piu forte: {c1} vs {c2} (r={r:.2f}).",
            "outliers": "Outlier rilevati nelle seguenti colonne: {cols}.",
            "duplicate": "Trovate {count} righe duplicate: valuta la deduplicazione.",
            "fallback": "Le distribuzioni sono globalmente stabili; verifica la segmentazione di business.",
        },
        "zh": {
            "dataset": "数据集包含 {rows} 行和 {cols} 列。",
            "missing": "检测到 {count} 个缺失值，建议进行插补。",
            "complete": "未检测到缺失值，数据完整性很好。",
            "corr": "最强相关性: {c1} 与 {c2} (r={r:.2f})。",
            "outliers": "以下列检测到异常值: {cols}。",
            "duplicate": "发现 {count} 条重复行，建议去重。",
            "fallback": "整体分布较稳定，可进一步结合业务分群分析。",
        },
    }
    labels = label_map.get(language, label_map["fr"])

    summary = analysis.get("summary", {})
    missing = analysis.get("missing_values", {})
    correlations = analysis.get("correlations", {}).get("top_pairs", [])
    outliers = analysis.get("outliers", {})

    total_rows = summary.get("total_rows", 0)
    total_cols = summary.get("total_columns", 0)
    insights.append(labels["dataset"].format(rows=total_rows, cols=total_cols))

    missing_cells = missing.get("total_missing_cells", 0)
    if missing_cells > 0:
        insights.append(labels["missing"].format(count=missing_cells))
    else:
        insights.append(labels["complete"])

    if correlations:
        best = correlations[0]
        insights.append(labels["corr"].format(c1=best['col1'], c2=best['col2'], r=best['correlation']))

    strong_outlier_cols = [col for col, val in outliers.items() if val.get("count", 0) > 0]
    if strong_outlier_cols:
        preview = ", ".join(strong_outlier_cols[:4])
        insights.append(labels["outliers"].format(cols=preview))

    if summary.get("duplicate_rows", 0) > 0:
        insights.append(labels["duplicate"].format(count=summary['duplicate_rows']))

    if len(insights) < 4:
        insights.append(labels["fallback"])

    return insights


def _openai_insights(analysis: Dict[str, Any], api_key: str, language: str = "fr") -> List[str]:
    try:
        from openai import OpenAI
    except Exception:
        return []

    client = OpenAI(api_key=api_key)
    
    prompts = {
        "fr": (
            "Tu es un data scientist expert en business intelligence et analyse prédictive. "
            "Analyse ce dataset et fournis 6-8 insights professionnels et actionnables. "
            "Focalise-toi sur:\n"
            "1. Patterns cachés et anomalies critiques\n"
            "2. Opportunités de segmentation métier\n"
            "3. Risques et points d'amélioration\n"
            "4. Corrélations significatives et leurs implications\n"
            "5. Recommandations stratégiques chiffrées\n"
            "Sois concis, précis et orienté ROI. Format: une bullet par ligne."
        ),
        "en": (
            "You are a senior data scientist expert in business intelligence and predictive analytics. "
            "Analyze this dataset and provide 6-8 professional and actionable insights. "
            "Focus on:\n"
            "1. Hidden patterns and critical anomalies\n"
            "2. Business segmentation opportunities\n"
            "3. Risks and improvement points\n"
            "4. Significant correlations and implications\n"
            "5. ROI-focused strategic recommendations\n"
            "Be concise, precise and business-oriented. Format: one bullet per line."
        ),
        "it": (
            "Sei uno scienziato dei dati senior esperto in business intelligence e analisi predittiva. "
            "Analizza questo dataset e fornisci 6-8 approfondimenti professionali e attuabili. "
            "Concentrati su:\n"
            "1. Pattern nascosti e anomalie critiche\n"
            "2. Opportunità di segmentazione di business\n"
            "3. Rischi e punti di miglioramento\n"
            "4. Correlazioni significative e implicazioni\n"
            "5. Raccomandazioni strategiche con ROI\n"
            "Sii conciso, preciso e orientato al business. Formato: un bullet per riga."
        ),
        "zh": (
            "你是一位高级数据科学家，擅长商业智能和预测分析。"
            "分析这个数据集并提供6-8条专业且可执行的见解。"
            "重点关注：\n"
            "1. 隐藏的模式和关键异常\n"
            "2. 业务分群机会\n"
            "3. 风险和改进点\n"
            "4. 显著相关性及其含义\n"
            "5. 以ROI为导向的战略建议\n"
            "简洁、精确、面向业务。格式：每行一个要点。"
        ),
    }
    
    system_prompt = prompts.get(language, prompts["fr"])
    
    summary = analysis.get("summary", {})
    report = analysis.get("report", {})
    correlations = analysis.get("correlations", {}).get("top_pairs", [])
    outliers_data = analysis.get("outliers", {})
    
    analysis_summary = (
        f"Dataset: {summary.get('total_rows', 0)} rows × {summary.get('total_columns', 0)} cols. "
        f"Quality: {report.get('quality_score', 0)}/100. "
        f"Missing: {summary.get('missing_values', 0)} cells. "
        f"Top correlation: {correlations[0]['col1']} ↔ {correlations[0]['col2']} (r={correlations[0]['correlation']:.2f})" 
        if correlations else "No strong correlations."
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Dataset summary: {analysis_summary}\n\nFull analysis:\n{analysis}"},
            ],
            temperature=0.4,
            max_tokens=800,
        )
        content = response.choices[0].message.content or ""
        lines = [line.strip("- •* ").strip() for line in content.split("\n") if line.strip() and len(line.strip()) > 10]
        return lines[:8]
    except Exception:
        return []


def generate_ai_insights(analysis: Dict[str, Any], openai_api_key: str | None = None, language: str = "fr") -> List[str]:
    insights = _heuristic_insights(analysis, language=language)
    api_key = openai_api_key or os.getenv("OPENAI_API_KEY")

    if api_key:
        openai_lines = _openai_insights(analysis, api_key, language=language)
        if openai_lines:
            return openai_lines

    return insights
