import type { Page, Route } from '@playwright/test';

// Deterministic API fixtures for e2e. The e2e CI job serves only the built SPA
// (via `vite preview`) with no backend, so these Playwright route handlers stand
// in for the NestJS API. Shapes mirror @pulse/contracts so the frontend's Zod
// validation passes. Real API integration is covered separately by the
// `api-e2e` CI job — here we only need deterministic data to exercise the UI.

// 90 days of steadily growing metrics. The upward trend guarantees that the
// 7-day window sums to a visibly different value than the 30-day window, which
// the "switching date range updates KPI" test relies on.
const dailyMetrics = Array.from({ length: 90 }, (_, dayIndex) => {
  const date = new Date(Date.UTC(2026, 0, 1));
  date.setUTCDate(date.getUTCDate() + dayIndex);
  return {
    date: date.toISOString().slice(0, 10),
    revenue: 1000 + dayIndex * 100,
    profit: 400 + dayIndex * 40,
    orders: 10 + dayIndex,
    users: 50 + dayIndex * 2,
    sessions: 100 + dayIndex * 3,
    conversionRate: 2 + (dayIndex % 5) * 0.1,
    avgOrderValue: 50 + (dayIndex % 7),
  };
});

const trafficSources = [
  { name: 'Organic', value: 4200, color: '#6366f1' },
  { name: 'Direct', value: 3100, color: '#10b981' },
  { name: 'Referral', value: 1800, color: '#f59e0b' },
];

// Mixed statuses so the "Completed"/"Pending"/"All" filter tests have rows to
// match, and every customer name contains an "a" for the search test.
const orders = [
  {
    id: 'ORD-1001',
    customer: 'Alice Anderson',
    email: 'alice@example.com',
    product: 'Pro Plan',
    amount: 199,
    status: 'completed',
    date: '2026-03-06',
    country: 'US',
  },
  {
    id: 'ORD-1002',
    customer: 'Bruno Alvarez',
    email: 'bruno@example.com',
    product: 'Starter',
    amount: 49,
    status: 'pending',
    date: '2026-03-05',
    country: 'ES',
  },
  {
    id: 'ORD-1003',
    customer: 'Diana Park',
    email: 'diana@example.com',
    product: 'Analytics Suite',
    amount: 349,
    status: 'completed',
    date: '2026-03-04',
    country: 'GB',
  },
  {
    id: 'ORD-1004',
    customer: 'Marco Bianchi',
    email: 'marco@example.com',
    product: 'Designer Pack',
    amount: 129,
    status: 'cancelled',
    date: '2026-03-03',
    country: 'IT',
  },
  {
    id: 'ORD-1005',
    customer: 'Sara Kane',
    email: 'sara@example.com',
    product: 'Pro Plan',
    amount: 199,
    status: 'refunded',
    date: '2026-03-02',
    country: 'US',
  },
  {
    id: 'ORD-1006',
    customer: 'Amara Okoye',
    email: 'amara@example.com',
    product: 'Starter',
    amount: 49,
    status: 'pending',
    date: '2026-03-01',
    country: 'NG',
  },
];

const products = [
  {
    id: 'PRD-1',
    name: 'Pro Plan',
    category: 'Subscription',
    revenue: 48420,
    orders: 312,
    growth: 18.4,
  },
  {
    id: 'PRD-2',
    name: 'Analytics Suite',
    category: 'Software',
    revenue: 31850,
    orders: 127,
    growth: 24.1,
  },
  {
    id: 'PRD-3',
    name: 'Designer Pack',
    category: 'Creative',
    revenue: 22340,
    orders: 186,
    growth: -5.2,
  },
  {
    id: 'PRD-4',
    name: 'Starter',
    category: 'Subscription',
    revenue: 15600,
    orders: 420,
    growth: 6.8,
  },
];

const customers = [
  {
    id: 'CUS-1',
    name: 'Alice Anderson',
    email: 'alice@example.com',
    segment: 'Enterprise',
    ltv: 12400,
    joinDate: '2025-01-15',
    country: 'US',
    orders: 42,
  },
  {
    id: 'CUS-2',
    name: 'Bruno Alvarez',
    email: 'bruno@example.com',
    segment: 'Pro',
    ltv: 5300,
    joinDate: '2025-06-02',
    country: 'ES',
    orders: 18,
  },
  {
    id: 'CUS-3',
    name: 'Amara Okoye',
    email: 'amara@example.com',
    segment: 'Starter',
    ltv: 900,
    joinDate: '2026-02-10',
    country: 'NG',
    orders: 4,
  },
];

const funnel = [
  { label: 'Visited', value: 10000, conversionRate: 100 },
  { label: 'Signed up', value: 3200, conversionRate: 32 },
  { label: 'Activated', value: 1400, conversionRate: 14 },
  { label: 'Purchased', value: 620, conversionRate: 6.2 },
];

const retention = [
  { cohort: '2026-01', weeks: [100, 68, 54, 47, 41] },
  { cohort: '2026-02', weeks: [100, 71, 59, 50] },
];

function fulfillJson(route: Route, body: unknown): Promise<void> {
  // Endpoint paths like `/orders` or `/products` also match the SPA's own client
  // routes. Only stub actual data fetches (xhr/fetch); let document navigations
  // fall through so the real index.html (and the React app) loads.
  const resourceType = route.request().resourceType();
  if (resourceType !== 'xhr' && resourceType !== 'fetch') {
    return route.fallback();
  }
  return route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });
}

/**
 * Registers Playwright route handlers for every backend endpoint the app calls.
 * Call this in `beforeEach` BEFORE `page.goto(...)` so the fetches on first
 * render are intercepted. Endpoints are matched by path so it works regardless
 * of the (possibly undefined) VITE_API_URL base used by the built app.
 */
export async function mockApi(page: Page): Promise<void> {
  await page.route(/\/metrics\b/, (route) => fulfillJson(route, dailyMetrics));
  await page.route(/\/traffic-sources\b/, (route) => fulfillJson(route, trafficSources));
  await page.route(/\/analytics\/funnel\b/, (route) => fulfillJson(route, funnel));
  await page.route(/\/analytics\/retention\b/, (route) => fulfillJson(route, retention));
  await page.route(/\/products\b/, (route) => fulfillJson(route, products));
  await page.route(/\/customers\b/, (route) => fulfillJson(route, customers));
  await page.route(/\/orders\b/, (route) =>
    fulfillJson(route, {
      data: orders,
      meta: { page: 1, limit: 100, total: orders.length, totalPages: 1 },
    }),
  );
}
