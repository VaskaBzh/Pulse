import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { topProducts } from '../../shared/data/mockData';
import { ProductCard } from './components/ProductCard';
import type { Product } from '../../shared/types';

type SortKey = 'revenue' | 'orders' | 'growth';

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'orders', label: 'Orders' },
  { key: 'growth', label: 'Growth' },
];

export function ProductsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('revenue');
  const [category, setCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const unique = [...new Set(topProducts.map((p) => p.category))];
    return ['All', ...unique];
  }, []);

  const handleSort = (key: SortKey) => {
    console.log('[Products] sort by:', key);
    setSortKey(key);
  };

  const sorted = useMemo((): Product[] => {
    const data = category === 'All' ? topProducts : topProducts.filter((p) => p.category === category);
    return [...data].sort((a, b) => b[sortKey] - a[sortKey]);
  }, [sortKey, category]);

  return (
    <div className="p-5 space-y-5 min-h-full">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Products</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Product catalog with performance metrics</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        {/* Sort */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Sort:</span>
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200/60 dark:border-slate-700/50">
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleSort(key)}
                className={clsx(
                  'px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-150',
                  sortKey === key
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Category:</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
