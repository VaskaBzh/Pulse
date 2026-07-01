import { clsx } from 'clsx';
import {
  AlertCircle,
  Bell,
  Download,
  MessageSquare,
  Moon,
  ShoppingCart,
  Sun,
  Menu,
  Users,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useExport } from '../../hooks/useExport';
import { useDashboardStore } from '../../store/dashboardStore';
import type { DateRange } from '../../types';
import { Popover } from '../ui/Popover';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    icon: ShoppingCart,
    title: 'New order received',
    description: 'Order #1042 — $156.00 from Alex M.',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    icon: Users,
    title: 'New user signed up',
    description: 'emma.wilson@example.com joined',
    time: '23 min ago',
    read: false,
  },
  {
    id: '3',
    icon: AlertCircle,
    title: 'Server load spike',
    description: 'CPU usage exceeded 85% threshold',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '4',
    icon: MessageSquare,
    title: 'Feedback submitted',
    description: 'Customer rated support 5/5 stars',
    time: '3 hours ago',
    read: true,
  },
] as const;

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
          aria-label="Toggle sidebar"
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
        <div
          role="group"
          aria-label="Date range"
          className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg p-1"
        >
          {RANGES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setDateRange(value)}
              aria-pressed={dateRange === value}
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

        <Popover
          placement="bottom"
          trigger={
            <button
              aria-label="Notifications"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {MOCK_NOTIFICATIONS.filter((n) => !n.read).length > 0 && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>
          }
          content={
            <div className="w-72">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Notifications
                </h3>
                <button className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
                  Mark all read
                </button>
              </div>
              <div className="space-y-1">
                {MOCK_NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={clsx(
                      'flex items-start gap-2.5 p-2 rounded-md transition-colors',
                      n.read ? 'opacity-60' : 'bg-indigo-50/50 dark:bg-indigo-950/30',
                    )}
                  >
                    <n.icon className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {n.description}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
        />

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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
