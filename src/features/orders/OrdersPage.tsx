import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { recentOrders } from '../../shared/data/mockData';
import { OrdersFilters } from './components/OrdersFilters';
import { OrdersTable } from './components/OrdersTable';
import type { StatusFilter } from './components/OrdersFilters';
import type { SortColumn, SortDir } from './components/OrdersTable';

const PAGE_SIZE = 10;

export function OrdersPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(0);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  const handleStatusChange = useCallback((v: StatusFilter) => {
    console.log('[Orders] filter changed', { status: v, query: debouncedQuery });
    setStatus(v);
    setPage(0);
  }, [debouncedQuery]);

  const handleSort = useCallback((col: SortColumn) => {
    setSortDir((prev) => (sortColumn === col ? (prev === 'asc' ? 'desc' : 'asc') : 'desc'));
    setSortColumn(col);
    setPage(0);
    console.log('[Orders] sort changed', { column: col, direction: sortColumn === col && sortDir === 'desc' ? 'asc' : 'desc' });
  }, [sortColumn, sortDir]);

  const filtered = useMemo(() => {
    let data = recentOrders;
    if (status !== 'all') data = data.filter((o) => o.status === status);
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
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
  }, [status, debouncedQuery, sortColumn, sortDir]);

  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="p-5 space-y-4 min-h-full">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Orders</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All customer transactions</p>
      </div>
      <OrdersFilters
        query={query}
        status={status}
        onQueryChange={setQuery}
        onStatusChange={handleStatusChange}
      />
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
    </div>
  );
}
