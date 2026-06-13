import { useState, useMemo, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchOrders } from '../../shared/api';
import { OrdersFilters } from './components/OrdersFilters';
import { OrdersTable } from './components/OrdersTable';
import type { OrdersFilterValues } from '../../shared/lib/validation';
import type { SortColumn, SortDir } from './components/OrdersTable';

const PAGE_SIZE = 10;

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
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All customer transactions</p>
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
        />
      )}
    </div>
  );
}
