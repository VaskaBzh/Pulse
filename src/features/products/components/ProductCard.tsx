import { TrendingUp, TrendingDown } from 'lucide-react';
import { clsx } from 'clsx';
import type { Product } from '../../../shared/types';

interface ProductCardProps {
  product: Product;
}

const CATEGORY_COLORS: Record<string, string> = {
  Subscription: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/25',
  Software: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/25',
  Creative: 'text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/25',
  License: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/25',
  Bundle: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/25',
};

export function ProductCard({ product }: ProductCardProps) {
  const positive = product.growth >= 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50 hover:shadow-md hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 transition-shadow duration-200">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{product.name}</p>
          <span className={clsx('text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-1 inline-block', CATEGORY_COLORS[product.category] ?? 'text-slate-500 bg-slate-100 dark:bg-slate-700')}>
            {product.category}
          </span>
        </div>
        <div className={clsx(
          'flex items-center gap-0.5 text-xs font-semibold shrink-0 mt-0.5',
          positive ? 'text-emerald-500' : 'text-rose-500',
        )}>
          {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
          {positive ? '+' : ''}{product.growth}%
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Revenue</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            ${(product.revenue / 1000).toFixed(1)}k
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Orders</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {product.orders.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
