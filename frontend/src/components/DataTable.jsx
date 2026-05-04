import { useMemo, useState } from 'react';
import { ArrowDownAZ, ArrowUpZA, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useI18n } from '../i18n';

function DataTable({ rows = [], columns = [] }) {
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    const base = term
      ? rows.filter((row) =>
          columns.some((col) => String(row[col] ?? '').toLowerCase().includes(term))
        )
      : rows;

    if (!sortCol) return base;

    return [...base].sort((a, b) => {
      const av = a[sortCol];
      const bv = b[sortCol];

      if (av == null) return 1;
      if (bv == null) return -1;

      if (!Number.isNaN(Number(av)) && !Number.isNaN(Number(bv))) {
        const delta = Number(av) - Number(bv);
        return sortDir === 'asc' ? delta : -delta;
      }

      const cmp = String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [rows, columns, search, sortCol, sortDir]);

  function toggleSort(col) {
    if (sortCol === col) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setSortCol(col);
    setSortDir('asc');
  }

  return (
    <div className="animate-rise">
      <Card className={`
        relative overflow-hidden
        border transition-all duration-300
        hover:shadow-lg hover:shadow-blue-500/10
        bg-gradient-to-br from-card to-card/95
        border-border/60
      `}>
        {/* Animated background */}
        <div className="absolute inset-0 opacity-0 hover:opacity-50 transition-opacity duration-300">
          <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-tl from-blue-500/5 to-purple-500/5 blur-3xl" />
        </div>

        <CardHeader className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border/50 pb-4">
          <CardTitle className="text-lg font-bold">{t('table.title')}</CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('table.filter')}
              className={`
                w-full rounded-xl border border-border/60 bg-card/80 px-3 py-2 pl-9
                text-sm outline-none
                transition-all duration-200
                hover:border-blue-400/50 hover:bg-card
                focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
              `}
            />
          </div>
        </CardHeader>
        <CardContent className="relative pt-0">
          <div className="overflow-auto rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-gradient-to-r from-muted/80 to-muted/60 backdrop-blur-sm border-b border-border/50">
                <tr>
                  {columns.map((col, colIdx) => (
                    <th key={col} className="px-4 py-3 font-semibold text-foreground/80 border-r border-border/30 last:border-r-0">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`
                          h-auto px-0 py-0 gap-1
                          transition-all duration-200
                          hover:text-blue-600 hover:translate-x-0.5
                        `}
                        onClick={() => toggleSort(col)}
                      >
                        <span className="text-xs uppercase tracking-wider font-bold">{col}</span>
                        {sortCol === col ? (
                          <div className="transition-transform duration-200">
                            {sortDir === 'asc' ? (
                              <ArrowDownAZ className="h-3.5 w-3.5 text-blue-600" />
                            ) : (
                              <ArrowUpZA className="h-3.5 w-3.5 text-blue-600" />
                            )}
                          </div>
                        ) : null}
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`
                      border-b border-border/30 transition-all duration-200
                      hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5
                      ${idx % 2 === 0 ? 'bg-card/30' : 'bg-card/50'}
                    `}
                  >
                    {columns.map((col) => (
                      <td
                        key={`${idx}-${col}`}
                        className="px-4 py-3 align-top text-foreground/80 border-r border-border/20 last:border-r-0 text-xs"
                      >
                        <span className="line-clamp-2">{String(row[col] ?? '-')}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center justify-between px-2">
            <p className="text-xs text-foreground/60 font-medium">
              {filteredRows.length} <span className="text-foreground/50">{t('table.rowsShown')}</span>
            </p>
            {search && (
              <p className="text-xs text-foreground/50">
                {Math.round((filteredRows.length / rows.length) * 100)}% {t('table.rowsShown')}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default DataTable;
