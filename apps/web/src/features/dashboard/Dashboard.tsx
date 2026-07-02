import { useQuery } from '@tanstack/react-query';
import { DollarSign, ShoppingCart, Users, TrendingUp, CreditCard, Activity } from 'lucide-react';
import { useEffect } from 'react';
import { OrdersBarChart } from './components/charts/OrdersBarChart';
import { RevenueAreaChart } from './components/charts/RevenueAreaChart';
import { TrafficDonutChart } from './components/charts/TrafficDonutChart';
import { RecentOrdersTable } from './components/tables/RecentOrdersTable';
import { TopProductsTable } from './components/tables/TopProductsTable';
import { fetchMetrics } from '../../shared/api';
import { KPICard } from '../../shared/components/ui/KPICard';
import { PageSkeleton } from '../../shared/components/ui/PageSkeleton';
import { logger } from '../../shared/lib/logger';
import { useDashboardStore } from '../../shared/store/dashboardStore';

export function Dashboard() {
  const summaryStats = useDashboardStore((s) => s.summaryStats);
  const filteredMetrics = useDashboardStore((s) => s.filteredMetrics);
  const setRawMetrics = useDashboardStore((s) => s.setRawMetrics);

  useEffect(() => {
    document.title = 'Dashboard — Pulse';
  }, []);

  // Always fetch the full 90-day window regardless of the selected UI period —
  // summaryStats compares the current period against an equally long previous
  // period, which requires 2x the longest selectable range (90d) of raw data.
  // Switching periods in the UI stays instant and client-side (see dashboardStore).
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['metrics', '90d'],
    queryFn: () => {
      logger.debug('[Dashboard] fetching metrics range=90d');
      return fetchMetrics('90d');
    },
    throwOnError: true,
  });

  useEffect(() => {
    if (metrics) {
      logger.debug(`[Dashboard] metrics loaded: ${metrics.length} entries`);
      setRawMetrics(metrics);
    }
  }, [metrics, setRawMetrics]);

  if (isLoading) {
    return <PageSkeleton />;
  }

  const spark = (
    key:
      'revenue' | 'profit' | 'orders' | 'users' | 'sessions' | 'conversionRate' | 'avgOrderValue',
  ) => filteredMetrics.slice(-14).map((m) => m[key] as number);

  const kpis = [
    {
      title: 'Total Revenue',
      value: `$${(summaryStats.revenue.current / 1000).toFixed(1)}k`,
      change: summaryStats.revenue.change,
      sparklineData: spark('revenue'),
      icon: <DollarSign className="w-4 h-4" />,
      color: '#6366f1',
    },
    {
      title: 'Total Orders',
      value: summaryStats.orders.current.toLocaleString(),
      change: summaryStats.orders.change,
      sparklineData: spark('orders'),
      icon: <ShoppingCart className="w-4 h-4" />,
      color: '#10b981',
    },
    {
      title: 'Active Users',
      value: `${(summaryStats.users.current / 1000).toFixed(1)}k`,
      change: summaryStats.users.change,
      sparklineData: spark('users'),
      icon: <Users className="w-4 h-4" />,
      color: '#3b82f6',
    },
    {
      title: 'Conv. Rate',
      value: `${summaryStats.conversionRate.current.toFixed(2)}%`,
      change: summaryStats.conversionRate.change,
      sparklineData: spark('conversionRate'),
      icon: <TrendingUp className="w-4 h-4" />,
      color: '#f59e0b',
    },
    {
      title: 'Avg. Order',
      value: `$${summaryStats.avgOrderValue.current.toFixed(0)}`,
      change: summaryStats.avgOrderValue.change,
      sparklineData: spark('avgOrderValue'),
      icon: <CreditCard className="w-4 h-4" />,
      color: '#8b5cf6',
    },
    {
      title: 'Sessions',
      value: `${(summaryStats.sessions.current / 1000).toFixed(1)}k`,
      change: summaryStats.sessions.change,
      sparklineData: spark('sessions'),
      icon: <Activity className="w-4 h-4" />,
      color: '#ec4899',
    },
  ];

  return (
    <div className="p-5 space-y-5 min-h-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <KPICard key={k.title} {...k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <RevenueAreaChart />
        </div>
        <TrafficDonutChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <OrdersBarChart />
        </div>
        <TopProductsTable />
      </div>

      <RecentOrdersTable />
    </div>
  );
}
