import { Badge } from './ui/badge';
import { Button } from './ui/button';
import KPICards from './KPICards';
import ChartGrid from './ChartGrid';
import DataTable from './DataTable';
import AIInsights from './AIInsights';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useI18n } from '../i18n';

const CHART_TYPES = ['bar', 'line', 'pie', 'scatter', 'heatmap', 'histogram'];

function Dashboard({
  analysis,
  charts,
  selectedColumn,
  setSelectedColumn,
  selectedTypes,
  setSelectedTypes,
  onExport,
}) {
  const { t } = useI18n();
  const columnTypes = analysis?.column_types || {};
  const report = analysis?.report || {};

  function toggleType(type) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 px-4 pb-10 pt-6 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              MYC AI Dashboard
            </h1>
          </div>
          <p className="text-sm text-foreground/70">{t('dashboard.subtitle')}</p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-medium">
            <span className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            <span>{analysis.filename}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => onExport('png')}>
            {t('dashboard.exportPng')}
          </Button>
          <Button variant="outline" onClick={() => onExport('pdf')}>
            {t('dashboard.exportPdf')}
          </Button>
        </div>
      </div>

      <KPICards summary={analysis.summary} />

      <Card className="overflow-hidden animate-rise">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-gradient-to-br from-accent/15 via-transparent to-orange-400/10 p-5 md:p-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white/60 px-3 py-1 text-xs font-semibold text-accent">
              {report.quality_label || t('dashboard.report')}
            </div>
            <h2 className="font-display text-2xl font-bold md:text-3xl">
              {report["overview_label"] || t('dashboard.reportOverview')} • {report.overview || t('dashboard.subtitle')}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-foreground/75">
              {report.source_hint || ''}
            </p>
          </div>
          <div className="border-t border-border/70 p-5 md:p-6 lg:border-l lg:border-t-0">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/60">{report.quality_label || t('dashboard.reportScore')}</p>
                <p className="mt-2 font-display text-5xl font-bold">{report.quality_score ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted px-4 py-3 text-right text-sm">
                <p className="text-foreground/60">{report.strengths_label || t('dashboard.reportStrengths')}</p>
                <p className="font-semibold">{(report.strengths || []).length}</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-foreground/60">{report.strengths_label || t('dashboard.reportStrengths')}</p>
                <ul className="space-y-1 text-sm">
                  {(report.strengths || []).slice(0, 4).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-2 text-xs uppercase tracking-wide text-foreground/60">{report.recommendations_label || t('dashboard.reportRecommendations')}</p>
                <ul className="space-y-1 text-sm">
                  {(report.recommendations || []).slice(0, 4).map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[280px_1fr]">
        <Card className="h-fit animate-rise">
          <CardHeader>
            <CardTitle>{t('dashboard.filters')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-foreground/60">{t('dashboard.filterColumn')}</p>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2 text-sm"
              >
                <option value="">{t('dashboard.allColumns')}</option>
                {analysis.columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-foreground/60">{t('dashboard.chartTypes')}</p>
              <div className="flex flex-wrap gap-2">
                {CHART_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleType(type)}
                    className={`rounded-full border px-3 py-1 text-xs transition ${
                      selectedTypes.includes(type)
                        ? 'border-accent bg-accent text-white'
                        : 'border-border bg-card text-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-foreground/60">{t('dashboard.detectedTypes')}</p>
              <div className="max-h-60 space-y-2 overflow-auto pr-1 text-sm">
                {Object.entries(columnTypes).map(([column, type]) => (
                  <div key={column} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2">
                    <span className="truncate">{column}</span>
                    <Badge>{type}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ChartGrid charts={charts} />
          <AIInsights insights={analysis.ai_insights} />
          <DataTable rows={analysis.data_preview} columns={analysis.columns} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
