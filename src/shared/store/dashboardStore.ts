import { create } from 'zustand';
import { allMetrics } from '../data/mockData';
import type { DateRange, DailyMetric, SummaryStats, Theme } from '../types';

function getDays(range: DateRange): number {
  return range === '7d' ? 7 : range === '30d' ? 30 : 90;
}

function sumField(arr: DailyMetric[], key: keyof DailyMetric): number {
  return arr.reduce((acc, m) => acc + (m[key] as number), 0);
}

function avgField(arr: DailyMetric[], key: keyof DailyMetric): number {
  return arr.length ? sumField(arr, key) / arr.length : 0;
}

function pct(curr: number, prev: number): number {
  return prev === 0 ? 0 : parseFloat(((curr - prev) / prev * 100).toFixed(1));
}

function computeStats(current: DailyMetric[], prev: DailyMetric[]): SummaryStats {
  const cRev = sumField(current, 'revenue');
  const pRev = sumField(prev, 'revenue');
  const cOrd = sumField(current, 'orders');
  const pOrd = sumField(prev, 'orders');
  const cUsr = sumField(current, 'users');
  const pUsr = sumField(prev, 'users');
  const cCR = avgField(current, 'conversionRate');
  const pCR = avgField(prev, 'conversionRate');
  const cAOV = avgField(current, 'avgOrderValue');
  const pAOV = avgField(prev, 'avgOrderValue');
  const cSes = sumField(current, 'sessions');
  const pSes = sumField(prev, 'sessions');

  return {
    revenue: { current: cRev, prev: pRev, change: pct(cRev, pRev) },
    orders: { current: cOrd, prev: pOrd, change: pct(cOrd, pOrd) },
    users: { current: cUsr, prev: pUsr, change: pct(cUsr, pUsr) },
    conversionRate: { current: cCR, prev: pCR, change: pct(cCR, pCR) },
    avgOrderValue: { current: cAOV, prev: pAOV, change: pct(cAOV, pAOV) },
    sessions: { current: cSes, prev: pSes, change: pct(cSes, pSes) },
  };
}

function buildState(range: DateRange) {
  const days = getDays(range);
  const current = allMetrics.slice(-days);
  const prev = allMetrics.slice(-(days * 2), -days);
  return {
    filteredMetrics: current,
    summaryStats: computeStats(current, prev),
  };
}

interface DashboardStore {
  theme: Theme;
  dateRange: DateRange;
  sidebarOpen: boolean;
  filteredMetrics: DailyMetric[];
  summaryStats: SummaryStats;

  toggleTheme: () => void;
  setDateRange: (range: DateRange) => void;
  toggleSidebar: () => void;
}

const initial30d = buildState('30d');

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  theme: 'dark',
  dateRange: '30d',
  sidebarOpen: true,
  ...initial30d,

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },

  setDateRange: (range) => set({ dateRange: range, ...buildState(range) }),

  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
