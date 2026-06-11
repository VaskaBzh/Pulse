import { clsx } from 'clsx';
import type { Order } from '../../../shared/types';

type StatusFilter = 'all' | Order['status'];

interface OrdersFiltersProps {
  query: string;
  status: StatusFilter;
  onQueryChange: (v: string) => void;
  onStatusChange: (v: StatusFilter) => void;
}

const STATUSES: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
];

export function OrdersFilters({ query, status, onQueryChange, onStatusChange }: OrdersFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        placeholder="Search by customer or email…"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      />
      <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200/60 dark:border-slate-700/50">
        {STATUSES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => onStatusChange(value)}
            className={clsx(
              'px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap',
              status === value
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

export type { StatusFilter };
