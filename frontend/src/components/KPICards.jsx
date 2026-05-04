import { Database, Columns3, AlertTriangle, Copy, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useI18n } from '../i18n';

const KPI_CONFIG = [
  {
    label: 'kpi.rows',
    icon: Database,
    gradient: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-300/30',
    iconColor: 'text-blue-600',
    getStatus: (v) => v > 10000 ? 'text-green-600' : 'text-foreground'
  },
  {
    label: 'kpi.columns',
    icon: Columns3,
    gradient: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-300/30',
    iconColor: 'text-purple-600',
    getStatus: (v) => v > 20 ? 'text-yellow-600' : 'text-green-600'
  },
  {
    label: 'kpi.missing',
    icon: AlertTriangle,
    gradient: 'from-orange-500/20 to-orange-600/10',
    border: 'border-orange-300/30',
    iconColor: 'text-orange-600',
    getStatus: (v) => v > 0 ? (v > 1000 ? 'text-red-600' : 'text-yellow-600') : 'text-green-600'
  },
  {
    label: 'kpi.duplicates',
    icon: Copy,
    gradient: 'from-red-500/20 to-red-600/10',
    border: 'border-red-300/30',
    iconColor: 'text-red-600',
    getStatus: (v) => v === 0 ? 'text-green-600' : 'text-red-600'
  },
];

function KPICards({ summary }) {
  const { t } = useI18n();
  const items = [
    { value: summary?.total_rows ?? 0 },
    { value: summary?.total_columns ?? 0 },
    { value: summary?.missing_values ?? 0 },
    { value: summary?.duplicate_rows ?? 0 },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, idx) => {
        const Icon = KPI_CONFIG[idx].icon;
        const config = KPI_CONFIG[idx];
        const statusColor = config.getStatus(item.value);
        
        return (
          <div
            key={idx}
            className="animate-rise group"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <Card className={`
              relative overflow-hidden h-full
              border transition-all duration-300
              hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1
              bg-gradient-to-br ${config.gradient} ${config.border}
              backdrop-blur-sm
            `}>
              {/* Animated background accent */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent rounded-full blur-3xl" />
              </div>

              <CardContent className="relative pt-6 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className={`
                    p-3 rounded-2xl
                    bg-gradient-to-br ${config.gradient}
                    border ${config.border}
                    transition-transform duration-300 group-hover:scale-110
                  `}>
                    <Icon className={`h-6 w-6 ${config.iconColor}`} />
                  </div>
                  <TrendingUp className={`h-4 w-4 ${statusColor} opacity-70`} />
                </div>

                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-foreground/60 font-semibold mb-2">
                    {t(config.label)}
                  </p>
                  <p className={`font-display text-4xl font-bold transition-all duration-300 ${statusColor}`}>
                    {item.value.toLocaleString()}
                  </p>
                </div>

                {/* Status indicator */}
                <div className="mt-4 flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${statusColor} animate-pulse`} />
                  <p className="text-xs text-foreground/60">
                    {item.value === 0 ? 'Excellent' : 'Attention requise'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      })}
    </div>
  );
}

export default KPICards;
