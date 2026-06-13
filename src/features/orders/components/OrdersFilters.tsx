import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clsx } from 'clsx';
import { ordersFilterSchema, type OrdersFilterValues } from '../../../shared/lib/validation';

interface OrdersFiltersProps {
  onFilterChange: (values: OrdersFilterValues) => void;
}

const STATUSES: { label: string; value: OrdersFilterValues['status'] }[] = [
  { label: 'All', value: 'all' },
  { label: 'Completed', value: 'completed' },
  { label: 'Pending', value: 'pending' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
];

export function OrdersFilters({ onFilterChange }: OrdersFiltersProps) {
  const { register, watch, setValue } = useForm<OrdersFilterValues>({
    resolver: zodResolver(ordersFilterSchema),
    defaultValues: { search: '', status: 'all' },
  });

  const values = watch();

  useEffect(() => {
    const id = setTimeout(() => {
      console.log('[OrdersFilters] form values changed', values);
      onFilterChange(values);
    }, 300);
    return () => clearTimeout(id);
  }, [values.search, values.status]);

  const currentStatus = watch('status');

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        {...register('search')}
        type="text"
        placeholder="Search by customer or email…"
        className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
      />
      <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200/60 dark:border-slate-700/50">
        {STATUSES.map(({ label, value }) => (
          <button
            key={value}
            type="button"
            onClick={() => setValue('status', value)}
            className={clsx(
              'px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150 whitespace-nowrap',
              currentStatus === value
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

export type { OrdersFilterValues as StatusFilter };
