import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { fetchOrders } from '../../../../shared/api';
import type { Order } from '../../../../shared/types';

const STATUS: Record<Order['status'], { label: string; dot: string; bg: string }> = {
  completed: {
    label: 'Completed',
    dot: 'bg-emerald-500',
    bg: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25',
  },
  pending: {
    label: 'Pending',
    dot: 'bg-amber-500',
    bg: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/25',
  },
  cancelled: {
    label: 'Cancelled',
    dot: 'bg-rose-500',
    bg: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/25',
  },
  refunded: {
    label: 'Refunded',
    dot: 'bg-slate-400',
    bg: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700',
  },
};

function SkeletonRow() {
  return (
    <tr className="border-b border-slate-50 dark:border-slate-700/30">
      {Array.from({ length: 6 }).map((_, i) => (
        <td key={i} className="px-5 py-3.5">
          <div className="animate-pulse h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export function RecentOrdersTable() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  console.log('[RecentOrdersTable] query state', { isLoading, count: orders?.length });

  const rows = orders?.slice(0, 10) ?? [];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Recent Orders
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Latest 10 transactions
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/50">
              {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date'].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
              : rows.map((order, i) => {
                  const s = STATUS[order.status];
                  return (
                    <tr
                      key={order.id}
                      className={clsx(
                        'hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors cursor-default',
                        i < rows.length - 1 && 'border-b border-slate-50 dark:border-slate-700/30',
                      )}
                    >
                      <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 dark:text-slate-500">
                        {order.id}
                      </td>
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {order.customer}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {order.country}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">
                        {order.product}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          ${order.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full',
                            s.bg,
                          )}
                        >
                          <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', s.dot)} />
                          {s.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-slate-400 dark:text-slate-500">
                        {order.date}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
