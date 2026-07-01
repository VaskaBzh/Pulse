import { clsx } from 'clsx';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  User,
  LogOut,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDashboardStore } from '../../store/dashboardStore';
import { Popover } from '../ui/Popover';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/analytics', label: 'Analytics', icon: TrendingUp },
  { to: '/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/reports', label: 'Reports', icon: FileText },
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useDashboardStore();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const isExpanded = isMobile || sidebarOpen;

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = !e.matches;
      setIsMobile(mobile);
      if (mobile) useDashboardStore.setState({ sidebarOpen: false });
    };
    handler(mql);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return (
    <>
      {isMobile && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30" onClick={toggleSidebar} />
      )}
      <aside
        className={clsx(
          'flex flex-col h-screen bg-slate-900 shrink-0 transition-all duration-300 ease-in-out',
          isMobile
            ? clsx(
                'fixed inset-y-0 left-0 z-40 w-60',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full',
              )
            : clsx('relative', sidebarOpen ? 'w-60' : 'w-[68px]'),
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 h-16 px-4 border-b border-slate-800/80">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600 shrink-0">
            <Zap className="w-4 h-4 text-white" fill="white" />
          </div>
          {isExpanded && (
            <span className="font-bold text-white text-lg tracking-tight whitespace-nowrap">
              Pulse
            </span>
          )}
        </div>

        {/* Nav */}
        <nav aria-label="Main navigation" className="flex-1 px-2 py-4 space-y-0.5 overflow-hidden">
          {isExpanded && (
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 mb-3">
              Main Menu
            </p>
          )}
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={!isExpanded ? label : undefined}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/25'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent',
                )
              }
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {isExpanded && <span className="whitespace-nowrap">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 pb-4 border-t border-slate-800/80 pt-4 space-y-0.5">
          <NavLink
            to="/settings"
            title={!isExpanded ? 'Settings' : undefined}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 border',
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border-indigo-500/25'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border-transparent',
              )
            }
          >
            <Settings className="w-[18px] h-[18px] shrink-0" />
            {isExpanded && <span>Settings</span>}
          </NavLink>

          <Popover
            placement="top"
            trigger={
              <div
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 mt-1 rounded-lg cursor-pointer hover:bg-slate-800 transition-colors',
                  !isExpanded && 'justify-center px-0',
                )}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  AJ
                </div>
                {isExpanded && (
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-200 truncate">Alex Johnson</p>
                    <p className="text-xs text-slate-500 truncate">admin@pulse.io</p>
                  </div>
                )}
              </div>
            }
            content={
              <div className="w-48">
                <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <User className="w-4 h-4" />
                  Profile
                </button>
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-slate-700 dark:text-slate-200 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                <button className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-rose-600 dark:text-rose-400 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </div>
            }
          />
        </div>

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center hover:bg-indigo-600 hover:border-indigo-500 transition-colors z-20 shadow-lg"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-3 h-3 text-slate-300" />
            ) : (
              <ChevronRight className="w-3 h-3 text-slate-300" />
            )}
          </button>
        )}
      </aside>
    </>
  );
}
