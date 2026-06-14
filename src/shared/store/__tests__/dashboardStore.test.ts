import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { DailyMetric } from '../../types';

const { mockAllMetrics } = vi.hoisted(() => {
  const mkMetric = (i: number): DailyMetric => ({
    date: `2024-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
    revenue: (i + 1) * 100,
    profit: (i + 1) * 50,
    orders: i + 1,
    users: i + 1,
    sessions: (i + 1) * 2,
    conversionRate: 2.5,
    avgOrderValue: 100,
  });
  return {
    mockAllMetrics: Array.from({ length: 180 }, (_, i) => mkMetric(i)) as DailyMetric[],
  };
});

vi.mock('../../data/mockData', () => ({
  allMetrics: mockAllMetrics,
}));

import { useDashboardStore } from '../dashboardStore';

const makeMetric = (i: number): DailyMetric => ({
  date: `2024-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 30) + 1).padStart(2, '0')}`,
  revenue: (i + 1) * 100,
  profit: (i + 1) * 50,
  orders: i + 1,
  users: i + 1,
  sessions: (i + 1) * 2,
  conversionRate: 2.5,
  avgOrderValue: 100,
});

const full180 = Array.from({ length: 180 }, (_, i) => makeMetric(i));

describe('dashboardStore', () => {
  beforeEach(() => {
    console.log('[test:dashboardStore] reset — restoring 180-entry mock');
    mockAllMetrics.splice(0, mockAllMetrics.length, ...full180);
    useDashboardStore.getState().setDateRange('30d');
    useDashboardStore.setState({ theme: 'dark', sidebarOpen: true });
  });

  afterEach(() => {
    console.log('[test:dashboardStore] test complete');
  });

  // ─── getDays ───────────────────────────────────────────────────────────────

  describe('getDays', () => {
    it.each([
      ['7d' as const, 7],
      ['30d' as const, 30],
      ['90d' as const, 90],
    ])("maps '%s' to %d filteredMetrics entries", (range, days) => {
      useDashboardStore.getState().setDateRange(range);
      expect(useDashboardStore.getState().filteredMetrics).toHaveLength(days);
    });
  });

  // ─── pct ───────────────────────────────────────────────────────────────────

  describe('pct', () => {
    it('computes non-zero positive change when sequential revenue increases', () => {
      useDashboardStore.getState().setDateRange('7d');
      const { revenue } = useDashboardStore.getState().summaryStats;
      expect(revenue.change).toBeGreaterThan(0);
      const expected = parseFloat(
        (((revenue.current - revenue.prev) / revenue.prev) * 100).toFixed(1),
      );
      expect(revenue.change).toBe(expected);
    });

    it('returns 0 change when prev period is empty (prev sum = 0 edge case)', () => {
      // 7 entries → slice(-14, -7) = [] → prev = 0 → pct returns 0
      mockAllMetrics.splice(
        0,
        mockAllMetrics.length,
        ...Array.from({ length: 7 }, (_, i) => makeMetric(i)),
      );
      useDashboardStore.getState().setDateRange('7d');
      const { revenue } = useDashboardStore.getState().summaryStats;
      expect(revenue.prev).toBe(0);
      expect(revenue.change).toBe(0);
    });
  });

  // ─── computeStats ──────────────────────────────────────────────────────────

  describe('computeStats', () => {
    it('includes all six metric keys with numeric current/prev/change', () => {
      const { summaryStats } = useDashboardStore.getState();
      const keys = [
        'revenue',
        'orders',
        'users',
        'conversionRate',
        'avgOrderValue',
        'sessions',
      ] as const;
      for (const key of keys) {
        expect(summaryStats[key]).toMatchObject({
          current: expect.any(Number),
          prev: expect.any(Number),
          change: expect.any(Number),
        });
      }
    });

    it('revenue.current equals sum of filteredMetrics.revenue', () => {
      const { filteredMetrics, summaryStats } = useDashboardStore.getState();
      const expected = filteredMetrics.reduce((s, m) => s + m.revenue, 0);
      expect(summaryStats.revenue.current).toBe(expected);
    });

    it('orders.current equals sum of filteredMetrics.orders', () => {
      const { filteredMetrics, summaryStats } = useDashboardStore.getState();
      const expected = filteredMetrics.reduce((s, m) => s + m.orders, 0);
      expect(summaryStats.orders.current).toBe(expected);
    });

    it('sessions.current equals sum of filteredMetrics.sessions', () => {
      const { filteredMetrics, summaryStats } = useDashboardStore.getState();
      const expected = filteredMetrics.reduce((s, m) => s + m.sessions, 0);
      expect(summaryStats.sessions.current).toBe(expected);
    });

    it('conversionRate.current equals avg of filteredMetrics.conversionRate', () => {
      const { filteredMetrics, summaryStats } = useDashboardStore.getState();
      const avg =
        filteredMetrics.reduce((s, m) => s + m.conversionRate, 0) / filteredMetrics.length;
      expect(summaryStats.conversionRate.current).toBeCloseTo(avg);
    });
  });

  // ─── state mutations ───────────────────────────────────────────────────────

  describe('setDateRange', () => {
    it('updates dateRange and recomputes filteredMetrics', () => {
      useDashboardStore.getState().setDateRange('7d');
      const state = useDashboardStore.getState();
      expect(state.dateRange).toBe('7d');
      expect(state.filteredMetrics).toHaveLength(7);
    });

    it('recomputes on each change', () => {
      useDashboardStore.getState().setDateRange('90d');
      expect(useDashboardStore.getState().filteredMetrics).toHaveLength(90);
      useDashboardStore.getState().setDateRange('7d');
      expect(useDashboardStore.getState().filteredMetrics).toHaveLength(7);
    });
  });

  describe('toggleTheme', () => {
    it('switches dark → light', () => {
      useDashboardStore.setState({ theme: 'dark' });
      useDashboardStore.getState().toggleTheme();
      expect(useDashboardStore.getState().theme).toBe('light');
    });

    it('switches light → dark', () => {
      useDashboardStore.setState({ theme: 'light' });
      useDashboardStore.getState().toggleTheme();
      expect(useDashboardStore.getState().theme).toBe('dark');
    });
  });

  describe('toggleSidebar', () => {
    it('flips sidebarOpen both ways', () => {
      useDashboardStore.setState({ sidebarOpen: true });
      useDashboardStore.getState().toggleSidebar();
      expect(useDashboardStore.getState().sidebarOpen).toBe(false);
      useDashboardStore.getState().toggleSidebar();
      expect(useDashboardStore.getState().sidebarOpen).toBe(true);
    });
  });

  // ─── filteredMetrics ───────────────────────────────────────────────────────

  describe('filteredMetrics', () => {
    it('updates when dateRange changes', () => {
      useDashboardStore.getState().setDateRange('30d');
      expect(useDashboardStore.getState().filteredMetrics).toHaveLength(30);
      useDashboardStore.getState().setDateRange('7d');
      expect(useDashboardStore.getState().filteredMetrics).toHaveLength(7);
    });

    it('contains the last N entries of allMetrics', () => {
      useDashboardStore.getState().setDateRange('7d');
      const { filteredMetrics } = useDashboardStore.getState();
      const expected = mockAllMetrics.slice(-7);
      expect(filteredMetrics).toEqual(expected);
    });
  });
});
