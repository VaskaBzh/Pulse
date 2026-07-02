import { clsx } from 'clsx';
import type { RetentionRow } from '../../../shared/types';

interface RetentionHeatmapProps {
  data: RetentionRow[];
}

function cellColor(value: number, theme: 'dark' | 'light'): string {
  if (value === 0)
    return theme === 'dark' ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-300';
  if (value >= 90) return 'bg-indigo-600 text-white';
  if (value >= 70) return 'bg-indigo-500 text-white';
  if (value >= 50) return 'bg-indigo-400 text-white';
  if (value >= 35) return 'bg-indigo-300 text-indigo-900 dark:text-white';
  if (value >= 20) return 'bg-indigo-200 text-indigo-800 dark:text-indigo-900';
  return theme === 'dark' ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500';
}

const WEEK_LABELS = ['W0', 'W1', 'W2', 'W3', 'W4', 'W5'];

export function RetentionHeatmap({ data }: RetentionHeatmapProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        Cohort Retention Heatmap
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
        % of users retained per week
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="text-left pb-2 pr-4 font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">
                Cohort
              </th>
              {WEEK_LABELS.map((w) => (
                <th
                  key={w}
                  className="pb-2 px-1 font-semibold text-slate-400 dark:text-slate-500 text-center min-w-[52px]"
                >
                  {w}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.cohort}>
                <td className="py-1 pr-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {row.cohort}
                </td>
                {row.weeks.map((val, wi) => (
                  <td key={wi} className="py-1 px-1">
                    <div
                      className={clsx(
                        'flex items-center justify-center rounded-md h-9 font-semibold tabular-nums transition-colors',
                        cellColor(val, 'dark'),
                      )}
                      title={val > 0 ? `${val}%` : 'N/A'}
                    >
                      {val > 0 ? `${val}%` : '—'}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <span className="text-[10px] text-slate-400 dark:text-slate-500">Low</span>
        {[
          'bg-slate-200 dark:bg-slate-700',
          'bg-indigo-200',
          'bg-indigo-300',
          'bg-indigo-400',
          'bg-indigo-500',
          'bg-indigo-600',
        ].map((c, i) => (
          <span key={i} className={clsx('w-5 h-3 rounded-sm', c)} />
        ))}
        <span className="text-[10px] text-slate-400 dark:text-slate-500">High</span>
      </div>
    </div>
  );
}
