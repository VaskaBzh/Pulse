import { useDashboardStore } from '../store/dashboardStore';

type ExportFormat = 'csv' | 'json';
type ReportType = 'metrics' | 'orders' | 'customers' | 'products';

export function useExport() {
  const filteredMetrics = useDashboardStore((s) => s.filteredMetrics);
  const dateRange = useDashboardStore((s) => s.dateRange);

  function download(content: string, filename: string, mime: string) {
    const blob = new Blob([content], { type: `${mime};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  const exportToCSV = () => {
    const headers = [
      'Date',
      'Revenue ($)',
      'Profit ($)',
      'Orders',
      'Users',
      'Sessions',
      'Conversion Rate (%)',
      'Avg Order Value ($)',
    ];
    const rows = filteredMetrics.map((m) => [
      m.date,
      m.revenue,
      m.profit,
      m.orders,
      m.users,
      m.sessions,
      m.conversionRate,
      m.avgOrderValue,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    download(
      csv,
      `pulse-analytics-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`,
      'text/csv',
    );
  };

  const exportData = (type: ReportType, format: ExportFormat, data: unknown[]) => {
    const filename = `pulse-${type}-${dateRange}-${new Date().toISOString().slice(0, 10)}`;
    if (format === 'json') {
      download(JSON.stringify(data, null, 2), `${filename}.json`, 'application/json');
    } else {
      if (data.length === 0) return;
      const headers = Object.keys(data[0] as object);
      const rows = (data as Record<string, unknown>[]).map((row) =>
        headers.map((h) => row[h] ?? ''),
      );
      const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
      download(csv, `${filename}.csv`, 'text/csv');
    }
  };

  return { exportToCSV, exportData };
}
