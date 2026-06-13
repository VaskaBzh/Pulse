import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { clsx } from 'clsx';
import { fetchOrders } from '../../shared/api';
import { Modal } from '../../shared/components/ui/Modal';
import { OrdersFilters } from './components/OrdersFilters';
import { OrdersTable } from './components/OrdersTable';
import type { OrdersFilterValues } from '../../shared/lib/validation';
import type { SortColumn, SortDir } from './components/OrdersTable';
import type { Order } from '../../shared/types';

const PAGE_SIZE = 10;

const STATUS_STYLES: Record<Order['status'], { label: string; dot: string; bg: string }> = {
  completed: { label: 'Completed', dot: 'bg-emerald-500', bg: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25' },
  pending: { label: 'Pending', dot: 'bg-amber-500', bg: 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/25' },
  cancelled: { label: 'Cancelled', dot: 'bg-rose-500', bg: 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/25' },
  refunded: { label: 'Refunded', dot: 'bg-slate-400', bg: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700' },
};

function SkeletonTable() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
      <div className="p-5 space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse h-10 bg-slate-100 dark:bg-slate-700 rounded" />
        ))}
      </div>
    </div>
  );
}

export function OrdersPage() {
  const [filters, setFilters] = useState<OrdersFilterValues>({ search: '', status: 'all' });
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: allOrders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  console.log('[Orders] query state', { isLoading, count: allOrders?.length });

  const handleFilterChange = useCallback((values: OrdersFilterValues) => {
    setFilters(values);
    setPage(0);
  }, []);

  const handleSort = useCallback((col: SortColumn) => {
    setSortDir((prev) => (sortColumn === col ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
    setSortColumn(col);
    setPage(0);
    console.log('[Orders] sort changed', { column: col });
  }, [sortColumn]);

  const handleRowClick = useCallback((order: Order) => {
    console.log('[Orders] order detail modal opened', { orderId: order.id });
    setSelectedOrder(order);
  }, []);

  const filtered = useMemo(() => {
    let data = allOrders ?? [];
    if (filters.status !== 'all') data = data.filter((o) => o.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      data = data.filter((o) =>
        o.customer.toLowerCase().includes(q) || o.email.toLowerCase().includes(q),
      );
    }
    data = [...data].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortColumn === 'amount') return (a.amount - b.amount) * dir;
      return a.date.localeCompare(b.date) * dir;
    });
    return data;
  }, [allOrders, filters, sortColumn, sortDir]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="p-5 space-y-4 min-h-full">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Orders</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All customer transactions · click a row for details</p>
      </div>

      <OrdersFilters onFilterChange={handleFilterChange} />

      {isLoading ? (
        <SkeletonTable />
      ) : (
        <OrdersTable
          orders={paged}
          sortColumn={sortColumn}
          sortDir={sortDir}
          onSort={handleSort}
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
          onRowClick={handleRowClick}
        />
      )}

      {selectedOrder && (
        <Modal
          isOpen
          onClose={() => setSelectedOrder(null)}
          title={`Order ${selectedOrder.id}`}
        >
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Customer</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-200">{selectedOrder.customer}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Email</dt>
              <dd className="text-slate-600 dark:text-slate-300">{selectedOrder.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Product</dt>
              <dd className="text-slate-600 dark:text-slate-300">{selectedOrder.product}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Amount</dt>
              <dd className="font-semibold text-slate-800 dark:text-slate-200">${selectedOrder.amount.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Status</dt>
              <dd>
                <span className={clsx('inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full', STATUS_STYLES[selectedOrder.status].bg)}>
                  <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', STATUS_STYLES[selectedOrder.status].dot)} />
                  {STATUS_STYLES[selectedOrder.status].label}
                </span>
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Date</dt>
              <dd className="text-slate-600 dark:text-slate-300">{selectedOrder.date}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Country</dt>
              <dd className="text-slate-600 dark:text-slate-300">{selectedOrder.country}</dd>
            </div>
          </dl>
        </Modal>
      )}
    </div>
  );
}
