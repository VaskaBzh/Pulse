import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { useDashboardStore } from '../../store/dashboardStore';
import { format, parseISO } from 'date-fns';

interface TpProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: TpProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 shadow-xl text-xs">
      <p className="text-slate-500 dark:text-slate-400 font-medium mb-1">
        {label ? format(parseISO(label), 'EEE, MMM d') : ''}
      </p>
      <p className="font-bold text-slate-900 dark:text-slate-100">{payload[0].value.toLocaleString()} orders</p>
    </div>
  );
}

export function OrdersBarChart() {
  const { filteredMetrics, theme } = useDashboardStore();
  const data = filteredMetrics.length > 30
    ? filteredMetrics.filter((_, i) => i % 2 === 0)
    : filteredMetrics;

  const tickFmt = (d: string) => { try { return format(parseISO(d), 'MMM d'); } catch { return d; } };
  const gridColor = theme === 'dark' ? '#1e293b' : '#f1f5f9';
  const axisColor = theme === 'dark' ? '#475569' : '#94a3b8';
  const barSize = data.length > 30 ? 5 : 12;

  const maxOrders = Math.max(...data.map((d) => d.orders));

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Daily Orders</h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Order volume per day</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
          <span className="text-xs text-slate-400 dark:text-slate-500">Orders</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={barSize}>
          <CartesianGrid stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={tickFmt}
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(99,102,241,0.06)' }} />
          <Bar dataKey="orders" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.orders >= maxOrders * 0.85 ? '#6366f1' : '#818cf8'}
                fillOpacity={0.85 + (entry.orders / maxOrders) * 0.15}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
