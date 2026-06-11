import { format, subDays } from 'date-fns';
import type { DailyMetric, Order, Product, TrafficSource } from '../types';

function sr(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function generateDailyMetrics(days: number = 90): DailyMetric[] {
  const metrics: DailyMetric[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const idx = days - i;
    const dayOfWeek = new Date(date).getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendBoost = isWeekend ? 1.28 : 1;
    const trend = 1 + idx * 0.0025;

    const orders = Math.round((110 + sr(idx * 7 + 1) * 70 - 15) * weekendBoost * trend);
    const avgOrderValue = Math.round(68 + sr(idx * 7 + 2) * 58);
    const revenue = orders * avgOrderValue;
    const profit = Math.round(revenue * (0.26 + sr(idx * 7 + 3) * 0.14));
    const sessions = Math.round(orders * (17 + sr(idx * 7 + 4) * 11));
    const users = Math.round(sessions * (0.62 + sr(idx * 7 + 5) * 0.16));
    const conversionRate = parseFloat(((orders / sessions) * 100).toFixed(2));

    metrics.push({ date, revenue, profit, orders, users, sessions, conversionRate, avgOrderValue });
  }

  return metrics;
}

export const allMetrics = generateDailyMetrics(90);

export const trafficSources: TrafficSource[] = [
  { name: 'Organic Search', value: 38, color: '#6366f1' },
  { name: 'Paid Ads', value: 24, color: '#10b981' },
  { name: 'Social Media', value: 19, color: '#f59e0b' },
  { name: 'Direct', value: 12, color: '#3b82f6' },
  { name: 'Referral', value: 7, color: '#ec4899' },
];

const COUNTRIES = ['USA', 'UK', 'Germany', 'France', 'Canada', 'Australia', 'Japan', 'Brazil'];
const PRODUCTS = ['Pro Plan', 'Starter Kit', 'Analytics Suite', 'Designer Pack', 'Enterprise License', 'Growth Bundle'];
const CUSTOMERS: [string, string][] = [
  ['Alex Johnson', 'alex@example.com'],
  ['Maria Garcia', 'maria@example.com'],
  ['James Wilson', 'james@example.com'],
  ['Emma Davis', 'emma@example.com'],
  ['Oliver Brown', 'oliver@example.com'],
  ['Sophie Miller', 'sophie@example.com'],
  ['Liam Taylor', 'liam@example.com'],
  ['Charlotte Anderson', 'charlotte@example.com'],
  ['Noah Thompson', 'noah@example.com'],
  ['Ava Martinez', 'ava@example.com'],
  ['William Jones', 'william@example.com'],
  ['Isabella White', 'isabella@example.com'],
];

export const recentOrders: Order[] = Array.from({ length: 28 }, (_, i) => {
  const s = (n: number) => sr(i * 17 + n);
  const customer = CUSTOMERS[Math.floor(s(1) * CUSTOMERS.length)];
  const daysAgo = Math.floor(s(2) * 14);
  const r = s(3) * 10;
  const status: Order['status'] = r < 6 ? 'completed' : r < 8 ? 'pending' : r < 9 ? 'cancelled' : 'refunded';
  return {
    id: `ORD-${(10000 + i * 137).toString()}`,
    customer: customer[0],
    email: customer[1],
    product: PRODUCTS[Math.floor(s(4) * PRODUCTS.length)],
    amount: Math.round((29 + s(5) * 271) * 100) / 100,
    status,
    date: format(subDays(new Date(), daysAgo), 'yyyy-MM-dd'),
    country: COUNTRIES[Math.floor(s(6) * COUNTRIES.length)],
  };
});

export const topProducts: Product[] = [
  { id: '1', name: 'Pro Plan', category: 'Subscription', revenue: 48420, orders: 312, growth: 18.4 },
  { id: '2', name: 'Analytics Suite', category: 'Software', revenue: 31850, orders: 127, growth: 24.1 },
  { id: '3', name: 'Designer Pack', category: 'Creative', revenue: 22340, orders: 186, growth: -5.2 },
  { id: '4', name: 'Starter Kit', category: 'Subscription', revenue: 18920, orders: 421, growth: 11.7 },
  { id: '5', name: 'Enterprise License', category: 'License', revenue: 16500, orders: 22, growth: 34.6 },
  { id: '6', name: 'Growth Bundle', category: 'Bundle', revenue: 12180, orders: 94, growth: 8.3 },
];
