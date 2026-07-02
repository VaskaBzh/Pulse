import { clsx } from 'clsx';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ReactNode } from 'react';

interface SparklineProps {
  data: number[];
  color: string;
}

function Sparkline({ data, color }: SparklineProps) {
  if (data.length < 2) return null;
  const W = 72;
  const H = 28;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * W,
    y: H - ((v - min) / range) * (H - 4) - 2,
  }));

  const pathD = pts.reduce((acc, p, i) => {
    if (i === 0) return `M${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    const prev = pts[i - 1];
    const cx = ((prev.x + p.x) / 2).toFixed(1);
    return `${acc} C${cx},${prev.y.toFixed(1)} ${cx},${p.y.toFixed(1)} ${p.x.toFixed(1)},${p.y.toFixed(1)}`;
  }, '');

  const gradId = `sg-${color.replace('#', '')}`;
  const areaD = `${pathD} L${W},${H} L0,${H} Z`;

  return (
    <svg width={W} height={H} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#${gradId})`} />
      <path d={pathD} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  change: number;
  sparklineData: number[];
  icon: ReactNode;
  color: string;
}

export function KPICard({ title, value, change, sparklineData, icon, color }: KPICardProps) {
  const positive = change > 0;
  const neutral = change === 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50 hover:shadow-md hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider leading-none">
          {title}
        </p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}1a` }}
        >
          <span style={{ color }}>{icon}</span>
        </div>
      </div>

      <p className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 tracking-tight">
        {value}
      </p>

      <div className="flex items-end justify-between">
        <div
          className={clsx(
            'flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md',
            neutral
              ? 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700'
              : positive
                ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25'
                : 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/25',
          )}
        >
          {!neutral &&
            (positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
          {neutral ? '—' : `${positive ? '+' : ''}${change}%`}
        </div>
        <Sparkline data={sparklineData} color={color} />
      </div>
    </div>
  );
}
