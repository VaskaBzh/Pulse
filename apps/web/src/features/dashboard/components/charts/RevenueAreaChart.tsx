import { format, parseISO } from 'date-fns';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardStore } from '../../../../shared/store/dashboardStore';

function fmt(v: number) {
  return v >= 1000 ? `$${(v / 1000).toFixed(1)}k` : `$${v}`;
}

interface TpProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: TpProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl text-xs">
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-2">
        {label ? format(parseISO(label), 'EEE, MMM d yyyy') : ''}
      </p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: e.color }} />
          <span className="text-slate-500 dark:text-slate-400 capitalize">{e.name}:</span>
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            ${e.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export function RevenueAreaChart() {
  const { filteredMetrics, theme } = useDashboardStore();
  const data =
    filteredMetrics.length > 30 ? filteredMetrics.filter((_, i) => i % 2 === 0) : filteredMetrics;

  const tickFmt = (d: string) => {
    try {
      return format(parseISO(d), 'MMM d');
    } catch {
      return d;
    }
  };
  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const axisColor = theme === 'dark' ? '#475569' : '#94a3b8';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Revenue & Profit
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Daily performance trend
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-6 h-0.5 bg-indigo-500 rounded-full inline-block" />
            Revenue
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="w-6 h-0.5 bg-emerald-500 rounded-full inline-block" />
            Profit
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gPro" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={gridColor} strokeDasharray="0" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={tickFmt}
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={fmt}
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            width={46}
          />
          <Tooltip
            content={<ChartTooltip />}
            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#gRev)"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gPro)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
