import { Moon, Sun, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { useDashboardStore } from '../../shared/store/dashboardStore';
import type { DateRange } from '../../shared/types';

const PERIODS: { value: DateRange; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
];

const APP_VERSION = '0.0.0';
const STACK = ['React 19', 'TypeScript 6', 'Tailwind CSS v4', 'Recharts v3', 'Zustand v5', 'Vite v8'];

export function SettingsPage() {
  const { theme, toggleTheme, dateRange, setDateRange } = useDashboardStore();

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('[Settings] theme toggled:', newTheme);
    toggleTheme();
  };

  const handlePeriodChange = (period: DateRange) => {
    console.log('[Settings] default period changed:', period);
    setDateRange(period);
  };

  return (
    <div className="p-5 space-y-5 min-h-full max-w-2xl">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Settings</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Application preferences</p>
      </div>

      {/* Appearance */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Appearance</h3>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === 'dark'
                ? <Moon className="w-5 h-5 text-indigo-400" />
                : <Sun className="w-5 h-5 text-amber-500" />
              }
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Theme</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Currently: {theme === 'dark' ? 'Dark' : 'Light'}
                </p>
              </div>
            </div>
            <button
              onClick={handleThemeToggle}
              className={clsx(
                'relative w-11 h-6 rounded-full transition-colors duration-200',
                theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-300',
              )}
            >
              <span className={clsx(
                'absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200',
                theme === 'dark' ? 'translate-x-5' : 'translate-x-0',
              )} />
            </button>
          </div>
        </div>
      </div>

      {/* Default period */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Default Period</h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Applied when the dashboard loads</span>
          </div>
          {PERIODS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="radio"
                name="period"
                value={value}
                checked={dateRange === value}
                onChange={() => handlePeriodChange(value)}
                className="w-4 h-4 accent-indigo-600"
              />
              <span className={clsx(
                'text-sm font-medium transition-colors',
                dateRange === value
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100',
              )}>
                {label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* About */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 dark:border-slate-700/50">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">About</h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Application</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Pulse Dashboard</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">Version</span>
            <span className="text-sm font-mono text-slate-600 dark:text-slate-300">v{APP_VERSION}</span>
          </div>
          <div>
            <span className="text-sm text-slate-500 dark:text-slate-400 block mb-2">Stack</span>
            <div className="flex flex-wrap gap-1.5">
              {STACK.map((tech) => (
                <span key={tech} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
