export interface DailyMetric {
  date: string;
  revenue: number;
  profit: number;
  orders: number;
  users: number;
  sessions: number;
  conversionRate: number;
  avgOrderValue: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: 'completed' | 'pending' | 'cancelled' | 'refunded';
  date: string;
  country: string;
}

export interface TrafficSource {
  name: string;
  value: number;
  color: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  segment: 'Enterprise' | 'Pro' | 'Starter';
  ltv: number;
  joinDate: string;
  country: string;
  orders: number;
}

export interface FunnelStep {
  label: string;
  value: number;
  conversionRate: number;
}

export interface RetentionRow {
  cohort: string;
  weeks: number[];
}

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
