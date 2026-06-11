import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from './shared/components/layout/Sidebar';
import { TopBar } from './shared/components/layout/TopBar';
import { useDashboardStore } from './shared/store/dashboardStore';

const DashboardPage = lazy(() => import('./features/dashboard').then((m) => ({ default: m.Dashboard })));

function AppLayout() {
  const theme = useDashboardStore((s) => s.theme);
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    console.log('[App] navigated to:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-[#080e1a]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-400">Loading…</div>}>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/analytics" element={<div className="p-5 text-slate-400">Analytics — coming soon</div>} />
              <Route path="/orders" element={<div className="p-5 text-slate-400">Orders — coming soon</div>} />
              <Route path="/customers" element={<div className="p-5 text-slate-400">Customers — coming soon</div>} />
              <Route path="/products" element={<div className="p-5 text-slate-400">Products — coming soon</div>} />
              <Route path="/reports" element={<div className="p-5 text-slate-400">Reports — coming soon</div>} />
              <Route path="/settings" element={<div className="p-5 text-slate-400">Settings — coming soon</div>} />
            </Routes>
          </Suspense>
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
