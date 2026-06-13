import type { FunnelStep } from '../../../shared/types';

interface FunnelChartProps {
  data: FunnelStep[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const maxValue = data[0]?.value ?? 1;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        Conversion Funnel
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-5">
        Visitor-to-paid conversion path
      </p>

      <div className="space-y-3">
        {data.map((step, i) => {
          const widthPct = (step.value / maxValue) * 100;
          const isLast = i === data.length - 1;
          return (
            <div key={step.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {step.label}
                </span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {step.value.toLocaleString()}
                </span>
              </div>
              <div className="relative h-9 bg-slate-100 dark:bg-slate-700/50 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-indigo-500/80 rounded-lg transition-all duration-700"
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              {!isLast && data[i + 1] && (
                <div className="flex items-center gap-1.5 mt-1.5 ml-1">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">↓</span>
                  <span className="text-[11px] font-semibold text-indigo-500 dark:text-indigo-400">
                    {data[i + 1].conversionRate}% conversion
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
