import { clsx } from 'clsx';

interface ReportPreviewProps {
  type: string;
  data: Record<string, unknown>[];
}

export function ReportPreview({ type, data }: ReportPreviewProps) {
  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50 p-8 text-center">
        <p className="text-sm text-slate-400">No data available for preview</p>
      </div>
    );
  }

  const headers = Object.keys(data[0]);
  const rows = data.slice(0, 5);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700/50">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Preview — {type} (first 5 rows)
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/50">
              {headers.map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={clsx(
                  'hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors',
                  i < rows.length - 1 && 'border-b border-slate-50 dark:border-slate-700/30',
                )}
              >
                {headers.map((h) => (
                  <td
                    key={h}
                    className="px-4 py-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap"
                  >
                    {String(row[h] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
