import { PrismaClient, OrderStatus, CustomerSegment } from '@prisma/client';

const prisma = new PrismaClient();

function sr(seed: number): number {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

const COUNTRIES = ['USA', 'UK', 'Germany', 'France', 'Canada', 'Australia', 'Japan', 'Brazil'];
const PRODUCTS = [
  'Pro Plan',
  'Starter Kit',
  'Analytics Suite',
  'Designer Pack',
  'Enterprise License',
  'Growth Bundle',
];
const CUSTOMER_NAMES: [string, string][] = [
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
const SEGMENTS: CustomerSegment[] = [
  CustomerSegment.ENTERPRISE,
  CustomerSegment.PRO,
  CustomerSegment.PRO,
  CustomerSegment.STARTER,
  CustomerSegment.STARTER,
  CustomerSegment.STARTER,
];

async function main() {
  const now = new Date();
  console.log('[Seed] Starting database seed...');

  // Idempotent: clear existing data
  await prisma.$transaction([
    prisma.retentionCohort.deleteMany(),
    prisma.funnelStep.deleteMany(),
    prisma.trafficSource.deleteMany(),
    prisma.customer.deleteMany(),
    prisma.product.deleteMany(),
    prisma.order.deleteMany(),
    prisma.dailyMetric.deleteMany(),
  ]);
  console.log('[Seed] Cleared existing data');

  // ── DailyMetrics (90 days) ─────────────────────────────────────────────────
  const days = 90;
  const metrics = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(now, i);
    const dateStr = formatDate(date);
    const idx = days - i;
    const dayOfWeek = new Date(dateStr).getDay();
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

    metrics.push({
      date: new Date(dateStr),
      revenue,
      profit,
      orders,
      users,
      sessions,
      conversionRate,
      avgOrderValue,
    });
  }
  await prisma.dailyMetric.createMany({ data: metrics });
  console.log(`[Seed] DailyMetric: ${metrics.length} rows`);

  // ── Orders (28) ────────────────────────────────────────────────────────────
  const orderData = Array.from({ length: 28 }, (_, i) => {
    const s = (n: number) => sr(i * 17 + n);
    const customer = CUSTOMER_NAMES[Math.floor(s(1) * CUSTOMER_NAMES.length)];
    const daysAgo = Math.floor(s(2) * 14);
    const r = s(3) * 10;
    const status: OrderStatus =
      r < 6
        ? OrderStatus.COMPLETED
        : r < 8
          ? OrderStatus.PENDING
          : r < 9
            ? OrderStatus.CANCELLED
            : OrderStatus.REFUNDED;
    return {
      id: `ORD-${(10000 + i * 137).toString()}`,
      customer: customer[0],
      email: customer[1],
      product: PRODUCTS[Math.floor(s(4) * PRODUCTS.length)],
      amount: Math.round((29 + s(5) * 271) * 100) / 100,
      status,
      date: new Date(formatDate(subDays(now, daysAgo))),
      country: COUNTRIES[Math.floor(s(6) * COUNTRIES.length)],
    };
  });
  await prisma.order.createMany({ data: orderData });
  console.log(`[Seed] Order: ${orderData.length} rows`);

  // ── Products (6) ───────────────────────────────────────────────────────────
  const productData = [
    {
      id: '1',
      name: 'Pro Plan',
      category: 'Subscription',
      revenue: 48420,
      orders: 312,
      growth: 18.4,
    },
    {
      id: '2',
      name: 'Analytics Suite',
      category: 'Software',
      revenue: 31850,
      orders: 127,
      growth: 24.1,
    },
    {
      id: '3',
      name: 'Designer Pack',
      category: 'Creative',
      revenue: 22340,
      orders: 186,
      growth: -5.2,
    },
    {
      id: '4',
      name: 'Starter Kit',
      category: 'Subscription',
      revenue: 18920,
      orders: 421,
      growth: 11.7,
    },
    {
      id: '5',
      name: 'Enterprise License',
      category: 'License',
      revenue: 16500,
      orders: 22,
      growth: 34.6,
    },
    { id: '6', name: 'Growth Bundle', category: 'Bundle', revenue: 12180, orders: 94, growth: 8.3 },
  ];
  await prisma.product.createMany({ data: productData });
  console.log(`[Seed] Product: ${productData.length} rows`);

  // ── Customers (20) ─────────────────────────────────────────────────────────
  const customerData = Array.from({ length: 20 }, (_, i) => {
    const s = (n: number) => sr(i * 31 + n);
    const [name, email] = CUSTOMER_NAMES[i % CUSTOMER_NAMES.length];
    const segment = SEGMENTS[Math.floor(s(1) * SEGMENTS.length)];
    const ltv =
      segment === CustomerSegment.ENTERPRISE
        ? Math.round(2000 + s(2) * 8000)
        : segment === CustomerSegment.PRO
          ? Math.round(500 + s(2) * 1500)
          : Math.round(50 + s(2) * 450);
    const orders = Math.round(
      1 +
        s(3) *
          (segment === CustomerSegment.ENTERPRISE ? 40 : segment === CustomerSegment.PRO ? 15 : 8),
    );
    const daysAgo = Math.round(30 + s(4) * 300);
    return {
      id: `USR-${(1000 + i * 43).toString()}`,
      name: i >= CUSTOMER_NAMES.length ? `${name} ${i}` : name,
      email: i >= CUSTOMER_NAMES.length ? `user${i}@example.com` : email,
      segment,
      ltv,
      joinDate: new Date(formatDate(subDays(now, daysAgo))),
      country: COUNTRIES[Math.floor(s(5) * COUNTRIES.length)],
      orders,
    };
  });
  await prisma.customer.createMany({ data: customerData });
  console.log(`[Seed] Customer: ${customerData.length} rows`);

  // ── TrafficSources (5) ─────────────────────────────────────────────────────
  const trafficData = [
    { name: 'Organic Search', value: 38, color: '#6366f1' },
    { name: 'Paid Ads', value: 24, color: '#10b981' },
    { name: 'Social Media', value: 19, color: '#f59e0b' },
    { name: 'Direct', value: 12, color: '#3b82f6' },
    { name: 'Referral', value: 7, color: '#ec4899' },
  ];
  await prisma.trafficSource.createMany({ data: trafficData });
  console.log(`[Seed] TrafficSource: ${trafficData.length} rows`);

  // ── FunnelSteps (4) ────────────────────────────────────────────────────────
  const funnelData = [
    { label: 'Visitors', value: 48200, conversionRate: 100 },
    { label: 'Signups', value: 12840, conversionRate: 26.6 },
    { label: 'Trials', value: 4310, conversionRate: 33.6 },
    { label: 'Paid', value: 1480, conversionRate: 34.3 },
  ];
  await prisma.funnelStep.createMany({ data: funnelData });
  console.log(`[Seed] FunnelStep: ${funnelData.length} rows`);

  // ── RetentionCohorts (6) ───────────────────────────────────────────────────
  const retentionData = [
    { cohort: 'Jan 2026', weeks: [100, 64, 50, 38, 30, 24] },
    { cohort: 'Feb 2026', weeks: [100, 61, 47, 35, 27, 21] },
    { cohort: 'Mar 2026', weeks: [100, 67, 53, 41, 32, 26] },
    { cohort: 'Apr 2026', weeks: [100, 59, 44, 33, 25, 0] },
    { cohort: 'May 2026', weeks: [100, 62, 48, 36, 0, 0] },
    { cohort: 'Jun 2026', weeks: [100, 65, 51, 0, 0, 0] },
  ];
  await prisma.retentionCohort.createMany({ data: retentionData });
  console.log(`[Seed] RetentionCohort: ${retentionData.length} rows`);

  console.log('[Seed] Done!');
}

main()
  .catch((e) => {
    console.error('[Seed] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
