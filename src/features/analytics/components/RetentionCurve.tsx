import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStore } from '../../../shared/store/dashboardStore';
import type { RetentionRow } from '../../../shared/types';

interface RetentionCurveProps {
  data: RetentionRow[];
}

interface TpProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: TpProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="font-bold text-indigo-600 dark:text-indigo-400">
        {payload[0].value.toFixed(1)}% retained
      </p>
    </div>
  );
}

function buildAverageRetention(data: RetentionRow[]): { week: string; value: number }[] {
  const maxWeeks = Math.max(...data.map((r) => r.weeks.length));
  return Array.from({ length: maxWeeks }, (_, wi) => {
    const values = data.map((r) => r.weeks[wi]).filter((v) => v > 0);
    const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    return { week: `Week ${wi}`, value: parseFloat(avg.toFixed(1)) };
  });
}

export function RetentionCurve({ data }: RetentionCurveProps) {
  const theme = useDashboardStore((s) => s.theme);
  const chartData = buildAverageRetention(data);

  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const axisColor = theme === 'dark' ? '#475569' : '#94a3b8';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        Average Retention Curve
      </h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">
        Mean retention across all cohorts
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[0, 100]}
          />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#6366f1"
            strokeWidth={2}
            dot={{ fill: '#6366f1', r: 3 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
