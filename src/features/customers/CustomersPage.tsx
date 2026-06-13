import { useState, useMemo } from 'react';
import { Users, DollarSign, UserPlus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchCustomers } from '../../shared/api';
import { useDashboardStore } from '../../shared/store/dashboardStore';
import { CustomersTable } from './components/CustomersTable';
import { clsx } from 'clsx';
import type { Customer } from '../../shared/types';

type SegmentFilter = 'All' | Customer['segment'];

const SEGMENT_FILTERS: SegmentFilter[] = ['All', 'Enterprise', 'Pro', 'Starter'];
const DAYS: Record<string, number> = { '7d': 7, '30d': 30, '90d': 90 };

function SkeletonKPI() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
      <div className="animate-pulse h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-3" />
      <div className="animate-pulse h-8 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
    </div>
  );
}

export function CustomersPage() {
  const [segment, setSegment] = useState<SegmentFilter>('All');
  const dateRange = useDashboardStore((s) => s.dateRange);

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers,
  });

  console.log('[Customers] query state', { isLoading, count: customers?.length });

  const handleSegmentChange = (s: SegmentFilter) => {
    console.log('[Customers] segment filter:', s);
    setSegment(s);
  };

  const newCustomers = useMemo(() => {
    if (!customers) return 0;
    const cutoffDays = DAYS[dateRange] ?? 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - cutoffDays);
    return customers.filter((c) => new Date(c.joinDate) >= cutoff).length;
  }, [customers, dateRange]);

  const avgLtv = useMemo(() => {
    if (!customers?.length) return 0;
    return Math.round(customers.reduce((sum, c) => sum + c.ltv, 0) / customers.length);
  }, [customers]);

  const filtered = useMemo(() =>
    segment === 'All' ? (customers ?? []) : (customers ?? []).filter((c) => c.segment === segment),
    [customers, segment],
  );

  const periodLabel = dateRange === '7d' ? 'Last 7 days' : dateRange === '30d' ? 'Last 30 days' : 'Last 90 days';

  return (
    <div className="p-5 space-y-5 min-h-full">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Customers</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Manage and analyze your customer base</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <SkeletonKPI key={i} />)
        ) : (
          <>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Customers</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/25">
                  <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{customers?.length ?? 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg LTV</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/25">
                  <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">${avgLtv.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">New ({periodLabel})</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-900/25">
                  <UserPlus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{newCustomers}</p>
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-fit border border-slate-200/60 dark:border-slate-700/50">
        {SEGMENT_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => handleSegmentChange(s)}
            className={clsx(
              'px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap',
              segment === s
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <CustomersTable customers={filtered} />
    </div>
  );
}
