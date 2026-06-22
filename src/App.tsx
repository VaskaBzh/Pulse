import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './shared/components/layout/Sidebar';
import { TopBar } from './shared/components/layout/TopBar';
import { ErrorBoundary } from './shared/components/ui/ErrorBoundary';
import { PageSkeleton } from './shared/components/ui/PageSkeleton';
import { useDashboardStore } from './shared/store/dashboardStore';

const DashboardPage = lazy(() =>
  import('./features/dashboard').then((m) => ({ default: m.Dashboard })),
);
const OrdersPage = lazy(() => import('./features/orders').then((m) => ({ default: m.OrdersPage })));
const AnalyticsPage = lazy(() =>
  import('./features/analytics').then((m) => ({ default: m.AnalyticsPage })),
);
const CustomersPage = lazy(() =>
  import('./features/customers').then((m) => ({ default: m.CustomersPage })),
);
const ProductsPage = lazy(() =>
  import('./features/products').then((m) => ({ default: m.ProductsPage })),
);
const ReportsPage = lazy(() =>
  import('./features/reports').then((m) => ({ default: m.ReportsPage })),
);
const SettingsPage = lazy(() =>
  import('./features/settings').then((m) => ({ default: m.SettingsPage })),
);

function AppLayout() {
  const theme = useDashboardStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-[#080e1a]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <ErrorBoundary>
            <Suspense fallback={<PageSkeleton />}>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
