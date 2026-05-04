from pathlib import Path
from typing import Any, Dict

import matplotlib.pyplot as plt
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

BASE_DIR = Path(__file__).resolve().parent.parent
EXPORT_DIR = BASE_DIR / "data" / "exports"


def export_dashboard_png(file_id: str, analysis: Dict[str, Any]) -> Path:
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = EXPORT_DIR / f"{file_id}.png"

    summary = analysis.get("summary", {})
    report = analysis.get("report", {})
    insights = analysis.get("ai_insights", [])[:5]

    fig, ax = plt.subplots(figsize=(12, 8))
    ax.axis("off")
    ax.set_title("AI Dashboard Pro - Snapshot", fontsize=18, fontweight="bold")

    lines = [
        f"Rows: {summary.get('total_rows', 'N/A')}",
        f"Columns: {summary.get('total_columns', 'N/A')}",
        f"Missing Values: {summary.get('missing_values', 'N/A')}",
        f"Duplicate Rows: {summary.get('duplicate_rows', 'N/A')}",
        f"Quality Score: {report.get('quality_score', 'N/A')}/100",
        "",
        "Report Overview:",
        report.get("overview", "N/A"),
        "",
        "AI Insights:",
    ] + [f"- {item}" for item in insights]

    ax.text(0.03, 0.9, "\n".join(lines), va="top", fontsize=12)
    fig.tight_layout()
    fig.savefig(out_path, dpi=200)
    plt.close(fig)
    return out_path


def export_dashboard_pdf(file_id: str, analysis: Dict[str, Any]) -> Path:
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    out_path = EXPORT_DIR / f"{file_id}.pdf"

    summary = analysis.get("summary", {})
    report = analysis.get("report", {})
    insights = analysis.get("ai_insights", [])[:8]

    c = canvas.Canvas(str(out_path), pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 18)
    c.drawString(40, height - 50, "AI Dashboard Pro - Report")

    c.setFont("Helvetica", 12)
    y = height - 90
    kpis = [
        f"Rows: {summary.get('total_rows', 'N/A')}",
        f"Columns: {summary.get('total_columns', 'N/A')}",
        f"Missing Values: {summary.get('missing_values', 'N/A')}",
        f"Duplicate Rows: {summary.get('duplicate_rows', 'N/A')}",
        f"Quality Score: {report.get('quality_score', 'N/A')}/100",
    ]

    for line in kpis:
        c.drawString(40, y, line)
        y -= 20

    y -= 10
    c.setFont("Helvetica-Bold", 13)
    c.drawString(40, y, "Report Overview")
    y -= 20
    c.setFont("Helvetica", 11)
    for line in [report.get("overview", ""), report.get("source_hint", "")]:
        if line:
            c.drawString(50, y, line[:120])
            y -= 16

    y -= 6
    c.setFont("Helvetica-Bold", 13)
    c.drawString(40, y, "AI Insights")
    y -= 24

    c.setFont("Helvetica", 11)
    for insight in insights:
        if y < 80:
            c.showPage()
            c.setFont("Helvetica", 11)
            y = height - 50
        c.drawString(50, y, f"- {insight[:110]}")
        y -= 18

    c.save()
    return out_path
