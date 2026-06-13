import { DollarSign, ShoppingCart, Users, TrendingUp, CreditCard, Activity } from 'lucide-react';
import { OrdersBarChart } from './components/charts/OrdersBarChart';
import { RevenueAreaChart } from './components/charts/RevenueAreaChart';
import { TrafficDonutChart } from './components/charts/TrafficDonutChart';
import { RecentOrdersTable } from './components/tables/RecentOrdersTable';
import { TopProductsTable } from './components/tables/TopProductsTable';
import { KPICard } from '../../shared/components/ui/KPICard';
import { useDashboardStore } from '../../shared/store/dashboardStore';

export function Dashboard() {
  const { summaryStats, filteredMetrics } = useDashboardStore();

  const spark = (
    key:
      | 'revenue'
      | 'profit'
      | 'orders'
      | 'users'
      | 'sessions'
      | 'conversionRate'
      | 'avgOrderValue',
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
