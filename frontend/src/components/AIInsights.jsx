import { BrainCircuit, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useI18n } from '../i18n';

function AIInsights({ insights = [] }) {
  const { t } = useI18n();
  return (
    <div className="group animate-rise">
      <Card className={`
        relative overflow-hidden h-full
        border transition-all duration-300
        hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1
        bg-gradient-to-br from-purple-500/5 via-card to-card
        border-purple-200/20
      `}>
        {/* Animated background gradient on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 blur-3xl" />
        </div>

        <CardHeader className="relative border-b border-border/50 pb-4">
          <CardTitle className="flex items-center gap-2 font-bold">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-200/30">
              <BrainCircuit className="h-5 w-5 text-purple-600 animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('insights.title')}
            </span>
            <Sparkles className="h-4 w-4 text-yellow-500 ml-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent className="relative pt-5">
          {insights.length === 0 ? (
            <p className="text-sm text-foreground/70 text-center py-6">{t('insights.empty')}</p>
          ) : (
            <ul className="space-y-2.5">
              {insights.map((insight, idx) => (
                <li
                  key={`${insight}-${idx}`}
                  className={`
                    group/item flex items-start gap-3 rounded-xl border
                    bg-gradient-to-r from-purple-500/10 to-blue-500/5
                    border-purple-200/30 p-3.5
                    transition-all duration-300
                    hover:bg-gradient-to-r hover:from-purple-500/15 hover:to-blue-500/10
                    hover:border-purple-300/50 hover:shadow-md hover:shadow-purple-500/10
                    hover:-translate-x-1
                  `}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <CheckCircle2 className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0 transition-transform group-hover/item:scale-110" />
                  <span className="text-sm leading-5 text-foreground/80 group-hover/item:text-foreground transition-colors">
                    {insight}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default AIInsights;
