import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  Brush,
} from 'recharts';
import { Download, Expand, Shrink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useI18n } from '../i18n';

const PIE_COLORS = ['#0f766e', '#f97316', '#14b8a6', '#f59e0b', '#0ea5e9', '#fb7185', '#84cc16'];

function FancyTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-2xl backdrop-blur-md">
      <p className="mb-1 text-xs uppercase tracking-wide text-foreground/60">{label}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-sm font-semibold" style={{ color: entry.color || entry.fill }}>
          {entry.name || entry.dataKey}: {String(entry.value)}
        </p>
      ))}
    </div>
  );
}

function HeatmapView({ data }) {
  const maxAbs = useMemo(
    () => Math.max(...data.map((d) => Math.abs(Number(d.value || 0))), 0.0001),
    [data]
  );

  return (
    <div className="scrollbar-thin max-h-72 overflow-auto rounded-xl border border-border p-2">
      <div className="grid min-w-[420px] grid-cols-2 gap-1 text-xs md:grid-cols-4">
        {data.map((item, idx) => {
          const value = Number(item.value || 0);
          const intensity = Math.abs(value) / maxAbs;
          const color = value >= 0 ? `rgba(20, 184, 166, ${intensity})` : `rgba(249, 115, 22, ${intensity})`;
          return (
            <div key={idx} className="rounded-lg border border-border p-2" style={{ backgroundColor: color }}>
              <p className="font-semibold">{item.x} x {item.y}</p>
              <p>{value.toFixed(2)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartRenderer({ chart, t }) {
  if (!chart?.data?.length) {
    return <p className="text-sm text-foreground/70">{t('charts.unavailable')}</p>;
  }

  if (chart.type === 'bar' || chart.type === 'histogram') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chart.data}>
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#0f766e" stopOpacity={0.65} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
          <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip content={<FancyTooltip />} cursor={{ fill: 'rgba(20, 184, 166, 0.08)' }} />
          <Bar dataKey="value" fill="url(#barGradient)" radius={[12, 12, 0, 0]} />
          <Brush dataKey="name" height={18} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chart.data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<FancyTooltip />} />
          <Line type="monotone" dataKey="value" stroke="url(#lineGradient)" strokeWidth={3} dot={false} strokeLinecap="round" />
          <Brush dataKey="name" height={18} />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === 'pie') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Tooltip content={<FancyTooltip />} />
          <Pie data={chart.data} dataKey="value" nameKey="name" outerRadius={105} innerRadius={58} paddingAngle={2} label>
            {chart.data.map((_, index) => (
              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === 'scatter') {
    return (
      <ResponsiveContainer width="100%" height={280}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
          <XAxis type="number" dataKey={chart.x} name={chart.x} />
          <YAxis type="number" dataKey={chart.y} name={chart.y} />
          <Tooltip content={<FancyTooltip />} cursor={{ strokeDasharray: '3 3', fill: 'rgba(14, 165, 233, 0.06)' }} />
          <Scatter data={chart.data} fill="#0ea5e9" />
        </ScatterChart>
      </ResponsiveContainer>
    );
  }

  if (chart.type === 'heatmap') {
    return <HeatmapView data={chart.data} />;
  }

  return <p className="text-sm text-foreground/70">{t('charts.unsupported')}</p>;
}

function downloadChartAsSvg(containerId, chartId) {
  const node = document.getElementById(containerId);
  if (!node) return;

  const svg = node.querySelector('svg');
  if (!svg) return;

  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${chartId}.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
}

function ChartGrid({ charts = [] }) {
  const { t } = useI18n();
  const [zoomedChart, setZoomedChart] = useState(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {charts.map((chart, idx) => {
          const containerId = `chart-${chart.id}-${idx}`;
          return (
            <div key={`${chart.id}-${idx}`} className="animate-rise group" style={{ animationDelay: `${idx * 100}ms` }}>
              <Card className={`
                h-full chart-resizable
                border transition-all duration-300
                hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1
                bg-gradient-to-br from-card to-card/95
                relative overflow-hidden
              `}>
                {/* Animated background gradient on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-3xl" />
                </div>

                <CardHeader className="relative flex flex-row items-center justify-between gap-3 border-b border-border/50 pb-4">
                  <CardTitle className="text-base font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {chart.title}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => downloadChartAsSvg(containerId, chart.id)}
                      className="transition-all hover:bg-blue-500/10 hover:border-blue-400/50"
                    >
                      <Download className="mr-1 h-4 w-4 transition-transform group-hover:scale-110" />
                      SVG
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => setZoomedChart(chart)}
                      className="transition-all hover:bg-purple-500/10 hover:border-purple-400/50"
                    >
                      <Expand className="h-4 w-4 transition-transform group-hover:scale-110" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="relative pt-6 pb-4">
                  <div id={containerId} className="transition-all duration-300 group-hover:scale-[1.02]">
                    <ChartRenderer chart={chart} t={t} />
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {zoomedChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="glass w-full max-w-5xl rounded-3xl p-6 border border-white/20 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {zoomedChart.title}
              </h3>
              <Button 
                variant="outline" 
                onClick={() => setZoomedChart(null)}
                className="transition-all hover:bg-red-500/10 hover:border-red-400/50"
              >
                <Shrink className="mr-2 h-4 w-4" />
                {t('charts.close')}
              </Button>
            </div>
            <div className="rounded-xl border border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              <ChartRenderer chart={zoomedChart} t={t} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChartGrid;
