import { useState, useMemo } from 'react';
import { Download } from 'lucide-react';
import { clsx } from 'clsx';
import { recentOrders, topProducts, customers } from '../../shared/data/mockData';
import { useDashboardStore } from '../../shared/store/dashboardStore';
import { useExport } from '../../shared/hooks/useExport';
import { ReportPreview } from './components/ReportPreview';

type ReportType = 'Sales' | 'Orders' | 'Customers' | 'Products';
type ExportFormat = 'CSV' | 'JSON';

const REPORT_TYPES: ReportType[] = ['Sales', 'Orders', 'Customers', 'Products'];
const EXPORT_FORMATS: ExportFormat[] = ['CSV', 'JSON'];

const PERIOD_LABELS: Record<string, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '90d': 'Last 90 days',
};

function buildPreviewData(type: ReportType, metrics: { date: string; revenue: number; profit: number; orders: number }[]): Record<string, unknown>[] {
  switch (type) {
    case 'Sales': return metrics.map((m) => ({ date: m.date, revenue: m.revenue, profit: m.profit }));
    case 'Orders': return recentOrders.map((o) => ({ id: o.id, customer: o.customer, amount: o.amount, status: o.status, date: o.date }));
    case 'Customers': return customers.map((c) => ({ name: c.name, email: c.email, segment: c.segment, ltv: c.ltv, country: c.country }));
    case 'Products': return topProducts.map((p) => ({ name: p.name, category: p.category, revenue: p.revenue, orders: p.orders, growth: `${p.growth}%` }));
    default: return [];
  }
}

export function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('Sales');
  const [format, setFormat] = useState<ExportFormat>('CSV');
  const { filteredMetrics, dateRange } = useDashboardStore();
  const { exportData } = useExport();

  const periodLabel = PERIOD_LABELS[dateRange] ?? dateRange;

  const previewData = useMemo(() => buildPreviewData(reportType, filteredMetrics), [reportType, filteredMetrics]);

  const handleExport = () => {
    console.log('[Reports] export triggered', { type: reportType, format, dateRange });
    const typeMap: Record<ReportType, string> = { Sales: 'metrics', Orders: 'orders', Customers: 'customers', Products: 'products' };
    exportData(typeMap[reportType] as 'metrics' | 'orders' | 'customers' | 'products', format.toLowerCase() as 'csv' | 'json', previewData);
  };

  return (
    <div className="p-5 space-y-5 min-h-full">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Reports</h2>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Generate and export data reports</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200/80 dark:border-slate-700/50 space-y-5">
        {/* Report type */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Report Type
          </label>
          <div className="flex flex-wrap gap-2">
            {REPORT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setReportType(t)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150',
                  reportType === t
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/25 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Export Format
          </label>
          <div className="flex gap-2">
            {EXPORT_FORMATS.map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={clsx(
                  'px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-150',
                  format === f
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/25 text-indigo-600 dark:text-indigo-400'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Period */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Period
          </label>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{periodLabel}</p>
        </div>

        {/* Export button */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg transition-colors shadow-sm shadow-indigo-600/25"
        >
          <Download className="w-4 h-4" />
          Export {reportType} as {format}
        </button>
      </div>

      <ReportPreview type={reportType} data={previewData} />
    </div>
  );
}
