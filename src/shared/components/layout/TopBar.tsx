import { clsx } from 'clsx';
import { Bell, Download, Moon, Sun, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useExport } from '../../hooks/useExport';
import { useDashboardStore } from '../../store/dashboardStore';
import type { DateRange } from '../../types';

const RANGES: { label: string; value: DateRange }[] = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
];

function pathToTitle(pathname: string): string {
  const segment = pathname.split('/').filter(Boolean)[0] ?? 'dashboard';
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function TopBar() {
  const { theme, toggleTheme, dateRange, setDateRange, toggleSidebar } = useDashboardStore();
  const { exportToCSV } = useExport();
  const location = useLocation();
  const pageTitle = pathToTitle(location.pathname);

  return (
    <header className="h-16 flex items-center justify-between px-5 border-b border-slate-200/70 dark:border-slate-700/50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors lg:hidden"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {RANGES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setDateRange(value)}
              className={clsx(
                'px-3 py-1 text-xs font-semibold rounded-md transition-all duration-150',
                dateRange === value
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <button
          onClick={exportToCSV}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-sm shadow-indigo-600/25"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
        </button>

        <button
          onClick={toggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
      </div>
    </header>
  );
}
