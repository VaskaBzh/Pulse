import { Test } from '@nestjs/testing';
import { MetricsService } from './metrics.service';
import { PrismaService } from '../prisma/prisma.service';

type MetricRow = {
  date: Date;
  revenue: number;
  profit: number;
  orders: number;
  users: number;
  sessions: number;
  conversionRate: number;
  avgOrderValue: number;
};

/**
 * Builds `count` contiguous daily rows ending at `latest` (inclusive), one per
 * UTC calendar day going backwards. `latest` is intentionally placed in the
 * past relative to the wall clock to reproduce finding A: the seed data is
 * fixed in the past, but `findByRange` used to anchor its window to `new Date()`.
 */
function buildRows(latest: Date, count: number): MetricRow[] {
  const rows: MetricRow[] = [];
  for (let i = 0; i < count; i++) {
    const date = new Date(latest);
    date.setUTCDate(date.getUTCDate() - i);
    rows.push({
      date,
      revenue: 1000,
      profit: 300,
      orders: 100,
      users: 800,
      sessions: 1500,
      conversionRate: 6.6,
      avgOrderValue: 70,
    });
  }
  return rows.reverse();
}

/**
 * Minimal in-memory Prisma double that honours the same `date` gte/lte window
 * the service builds, so the windowing logic is genuinely exercised (a stub
 * that returned every row would hide the drift bug).
 */
type FindFirstArgs = { orderBy?: { date?: 'asc' | 'desc' } };
type FindManyArgs = { where?: { date?: { gte?: Date; lte?: Date } } };

function makePrismaMock(rows: MetricRow[]) {
  return {
    dailyMetric: {
      findFirst: jest.fn(async ({ orderBy }: FindFirstArgs) => {
        const dir = orderBy?.date === 'desc' ? -1 : 1;
        const sorted = [...rows].sort((a, b) => (a.date.getTime() - b.date.getTime()) * dir);
        return sorted[0] ?? null;
      }),
      findMany: jest.fn(async ({ where }: FindManyArgs) => {
        const gte = where?.date?.gte;
        const lte = where?.date?.lte;
        return rows
          .filter((r) => (!gte || r.date >= gte) && (!lte || r.date <= lte))
          .sort((a, b) => a.date.getTime() - b.date.getTime());
      }),
    },
  };
}

async function createService(rows: MetricRow[]) {
  const prisma = makePrismaMock(rows);
  const moduleRef = await Test.createTestingModule({
    providers: [MetricsService, { provide: PrismaService, useValue: prisma }],
  }).compile();
  return moduleRef.get(MetricsService);
}

describe('MetricsService.findByRange', () => {
  // Anchor the seed 10 days in the past so "today" has moved beyond the last
  // available data point — the exact condition that made 90d return 89/88/…
  const latest = new Date();
  latest.setUTCHours(0, 0, 0, 0);
  latest.setUTCDate(latest.getUTCDate() - 10);

  it.each([
    ['7d', 7],
    ['30d', 30],
    ['90d', 90],
  ] as const)('returns exactly %s worth of rows when data is in the past', async (range, expected) => {
    const service = await createService(buildRows(latest, 90));

    const result = await service.findByRange(range);

    expect(result).toHaveLength(expected);
  });

  it('caps at the number of available rows for wide ranges', async () => {
    const service = await createService(buildRows(latest, 20));

    const result = await service.findByRange('90d');

    expect(result).toHaveLength(20);
  });

  it('returns an empty array when there is no data', async () => {
    const service = await createService([]);

    const result = await service.findByRange('30d');

    expect(result).toEqual([]);
  });
});
