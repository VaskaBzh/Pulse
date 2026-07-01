import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { fetchTrafficSources } from '../../../../shared/api';

interface TpProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { color: string } }[];
}

function ChartTooltip({ active, payload }: TpProps) {
  if (!active || !payload?.length) return null;
  const {
    name,
    value,
    payload: { color },
  } = payload[0];
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
        <span className="text-slate-600 dark:text-slate-300">{name}</span>
        <span className="font-bold text-slate-900 dark:text-slate-100">{value}%</span>
      </div>
    </div>
  );
}

export function TrafficDonutChart() {
  const { data, isLoading } = useQuery({
    queryKey: ['trafficSources'],
    queryFn: fetchTrafficSources,
    throwOnError: true,
  });

  const trafficSources = data ?? [];
  const total = trafficSources.reduce((a, b) => a + b.value, 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Traffic Sources
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
          Where visitors come from
        </p>
      </div>

      {isLoading ? (
        <div className="animate-pulse h-[152px] rounded-full w-[152px] mx-auto bg-slate-200 dark:bg-slate-700" />
      ) : (
        <>
          <div className="relative">
            <ResponsiveContainer width="100%" height={152}>
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {trafficSources.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{total}%</span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Coverage
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {trafficSources.map((s) => (
              <div key={s.name} className="flex items-center gap-2.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: s.color }}
                />
                <span className="text-xs text-slate-600 dark:text-slate-300 flex-1 truncate">
                  {s.name}
                </span>
                <div className="h-1 w-14 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.value}%`, background: s.color }}
                  />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 w-7 text-right">
                  {s.value}%
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
