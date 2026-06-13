import { clsx } from 'clsx';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import type { Order } from '../../../shared/types';

export type SortColumn = 'date' | 'amount';
export type SortDir = 'asc' | 'desc';

interface OrdersTableProps {
  orders: Order[];
  sortColumn: SortColumn;
  sortDir: SortDir;
  onSort: (col: SortColumn) => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (p: number) => void;
  onRowClick?: (order: Order) => void;
}

const STATUS: Record<Order['status'], { label: string; dot: string; bg: string }> = {
  completed: { label: 'Completed', dot: 'bg-emerald-500', bg: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25' },
  pending: { label: 'Pending', dot: 'bg-amber-500', bg: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/25' },
  cancelled: { label: 'Cancelled', dot: 'bg-rose-500', bg: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/25' },
  refunded: { label: 'Refunded', dot: 'bg-slate-400', bg: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700' },
};

function SortIcon({ col, sortColumn, sortDir }: { col: SortColumn; sortColumn: SortColumn; sortDir: SortDir }) {
  if (col !== sortColumn) return <ChevronsUpDown className="w-3 h-3 text-slate-400" />;
  return sortDir === 'asc'
    ? <ChevronUp className="w-3 h-3 text-indigo-500" />
    : <ChevronDown className="w-3 h-3 text-indigo-500" />;
}

export function OrdersTable({ orders, sortColumn, sortDir, onSort, page, pageSize, total, onPageChange, onRowClick }: OrdersTableProps) {
  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);

  const SORTABLE_COLS: { key: SortColumn; label: string }[] = [
    { key: 'date', label: 'Date' },
    { key: 'amount', label: 'Amount' },
  ];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/50">
              {['Order ID', 'Customer', 'Product'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
              {SORTABLE_COLS.map(({ key, label }) => (
                <th key={key} className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <button
                    onClick={() => onSort(key)}
                    className="flex items-center gap-1 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    {label}
                    <SortIcon col={key} sortColumn={sortColumn} sortDir={sortDir} />
                  </button>
                </th>
              ))}
              <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">No orders found</td>
              </tr>
            ) : orders.map((order, i) => {
              const s = STATUS[order.status];
              return (
                <tr
                  key={order.id}
                  onClick={() => onRowClick?.(order)}
                  className={clsx(
                    'hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors',
                    onRowClick ? 'cursor-pointer' : 'cursor-default',
                    i < orders.length - 1 && 'border-b border-slate-50 dark:border-slate-700/30',
                  )}
                >
                  <td className="px-5 py-3.5 font-mono text-[11px] text-slate-400 dark:text-slate-500">{order.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{order.customer}</p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{order.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">{order.product}</td>
                  <td className="px-5 py-3.5 text-[11px] text-slate-400 dark:text-slate-500">{order.date}</td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">${order.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={clsx('inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full', s.bg)}>
                      <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', s.dot)} />
                      {s.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-700/50">
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {start}–{end} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Prev
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
