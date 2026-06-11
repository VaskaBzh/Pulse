import { useDashboardStore } from '../store/dashboardStore';

export function useExport() {
  const filteredMetrics = useDashboardStore((s) => s.filteredMetrics);
  const dateRange = useDashboardStore((s) => s.dateRange);

  const exportToCSV = () => {
    const headers = ['Date', 'Revenue ($)', 'Profit ($)', 'Orders', 'Users', 'Sessions', 'Conversion Rate (%)', 'Avg Order Value ($)'];
    const rows = filteredMetrics.map((m) => [
      m.date, m.revenue, m.profit, m.orders, m.users, m.sessions, m.conversionRate, m.avgOrderValue,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pulse-analytics-${dateRange}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { exportToCSV };
}
