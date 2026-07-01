export type {
  DailyMetric,
  Order,
  Product,
  Customer,
  TrafficSource,
  FunnelStep,
  RetentionRow,
} from '@pulse/contracts';

export interface SummaryStats {
  revenue: { current: number; prev: number; change: number };
  orders: { current: number; prev: number; change: number };
  users: { current: number; prev: number; change: number };
  conversionRate: { current: number; prev: number; change: number };
  avgOrderValue: { current: number; prev: number; change: number };
  sessions: { current: number; prev: number; change: number };
}

export type DateRange = '7d' | '30d' | '90d';
export type Theme = 'light' | 'dark';
