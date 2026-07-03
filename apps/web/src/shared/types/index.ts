// Domain types now live in entities/*/model.ts (FSD entities layer).
// Re-exported here for backward compatibility — prefer importing from entities/*.
export type { DailyMetric, DateRange } from '../../entities/metric';
export type { TrafficSource } from '../../entities/traffic-source';
export type { Order } from '../../entities/order';
export type { Product, FunnelStep, RetentionRow } from '../../entities/product';
export type { Customer } from '../../entities/customer';

export interface SummaryStats {
  revenue: { current: number; prev: number; change: number };
  orders: { current: number; prev: number; change: number };
  users: { current: number; prev: number; change: number };
  conversionRate: { current: number; prev: number; change: number };
  avgOrderValue: { current: number; prev: number; change: number };
  sessions: { current: number; prev: number; change: number };
}

export type Theme = 'light' | 'dark';
