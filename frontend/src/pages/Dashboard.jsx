import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard';
import { analyzeFile, exportDashboard, getCharts } from '../services/api';
import { useI18n } from '../i18n';

function DashboardPage() {
  const { t, language } = useI18n();
  const { fileId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [allCharts, setAllCharts] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function run() {
      try {
        setLoading(true);
        setError('');

        const analysisData = await analyzeFile(fileId, language);
        const chartData = await getCharts(fileId, { language });

        if (!mounted) return;

        setAnalysis(analysisData);
        setAllCharts(chartData.charts || []);
      } catch (err) {
        if (!mounted) return;
        setError(err?.response?.data?.detail || t('dashboard.error.default'));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    run();

    return () => {
      mounted = false;
    };
  }, [fileId, language]);

  const visibleCharts = useMemo(() => {
    return allCharts.filter((chart) => {
      const byType = selectedTypes.length === 0 || selectedTypes.includes(chart.type);
      const byColumn =
        !selectedColumn ||
        chart.x === selectedColumn ||
        chart.y === selectedColumn ||
        chart.label === selectedColumn;
      return byType && byColumn;
    });
  }, [allCharts, selectedColumn, selectedTypes]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold">{t('dashboard.loading.title')}</h2>
          <p className="mt-2 text-sm text-foreground/70">{t('dashboard.loading.text')}</p>
          <div className="mx-auto mt-5 h-2 w-64 rounded-full bg-muted">
            <div className="h-2 w-2/3 animate-pulse rounded-full bg-accent" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="glass max-w-lg rounded-2xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-red-500">{t('dashboard.error.title')}</h2>
          <p className="mt-2 text-sm">{error || t('dashboard.error.default')}</p>
        </div>
      </div>
    );
  }

  return (
    <Dashboard
      analysis={analysis}
      charts={visibleCharts}
      selectedColumn={selectedColumn}
      setSelectedColumn={setSelectedColumn}
      selectedTypes={selectedTypes}
      setSelectedTypes={setSelectedTypes}
      onExport={(format) => exportDashboard(fileId, format, language)}
    />
  );
}

export default DashboardPage;
