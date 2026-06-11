import { clsx } from 'clsx';
import { SegmentBadge } from './SegmentBadge';
import type { Customer } from '../../../shared/types';

interface CustomersTableProps {
  customers: Customer[];
}

export function CustomersTable({ customers }: CustomersTableProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-700/50">
              {['Name', 'Segment', 'LTV', 'Country', 'Orders', 'Joined'].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">No customers found</td>
              </tr>
            ) : customers.map((c, i) => (
              <tr
                key={c.id}
                className={clsx(
                  'hover:bg-slate-50/70 dark:hover:bg-slate-700/30 transition-colors cursor-default',
                  i < customers.length - 1 && 'border-b border-slate-50 dark:border-slate-700/30',
                )}
              >
                <td className="px-5 py-3.5">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{c.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{c.email}</p>
                </td>
                <td className="px-5 py-3.5">
                  <SegmentBadge segment={c.segment} />
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">${c.ltv.toLocaleString()}</span>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300">{c.country}</td>
                <td className="px-5 py-3.5 text-sm text-slate-600 dark:text-slate-300 tabular-nums">{c.orders}</td>
                <td className="px-5 py-3.5 text-[11px] text-slate-400 dark:text-slate-500">{c.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
