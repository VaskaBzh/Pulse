import { topProducts } from '../../data/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';

const CATEGORY_COLORS: Record<string, string> = {
  Subscription: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/25',
  Software: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/25',
  Creative: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/25',
  License: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25',
  Bundle: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/25',
};

export function TopProductsTable() {
  const maxRev = topProducts[0].revenue;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Top Products</h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">By revenue this period</p>
      </div>

      <div className="p-5 space-y-5">
        {topProducts.map((p, i) => (
          <div key={p.id} className="flex items-start gap-3">
            <span className="text-xs font-bold text-slate-300 dark:text-slate-600 w-4 mt-0.5 shrink-0 tabular-nums">
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{p.name}</span>
                  <span className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0', CATEGORY_COLORS[p.category] ?? 'text-slate-500 bg-slate-100 dark:bg-slate-700')}>
                    {p.category}
                  </span>
                </div>
                <div className={clsx(
                  'flex items-center gap-0.5 text-xs font-semibold shrink-0',
                  p.growth >= 0 ? 'text-emerald-500' : 'text-rose-500',
                )}>
                  {p.growth >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {Math.abs(p.growth)}%
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                    style={{ width: `${(p.revenue / maxRev) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 w-14 text-right tabular-nums">
                  ${(p.revenue / 1000).toFixed(1)}k
                </span>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{p.orders} orders</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
