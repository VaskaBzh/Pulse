import { Test } from '@nestjs/testing';
import { OrderStatus, type Order as PrismaOrder } from '@prisma/client';
import type { OrdersQuery } from '@pulse/contracts';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

function buildOrders(count: number): PrismaOrder[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `ORD-${i}`,
    customer: i % 2 === 0 ? 'Alice' : 'Bob',
    email: `user${i}@example.com`,
    product: 'Pro Plan',
    amount: 100 + i,
    status: i % 5 === 0 ? OrderStatus.PENDING : OrderStatus.COMPLETED,
    date: new Date(Date.UTC(2026, 0, 1 + i)),
    country: 'USA',
  }));
}

/**
 * In-memory Prisma double honouring the exact query shape `OrdersService`
 * builds (status/search filter, orderBy, skip/take) so pagination + `count`
 * are genuinely exercised — the UI now trusts `meta.total`, so a stub that
 * ignored skip/take would give false confidence.
 */
type WhereArg = {
  status?: OrderStatus;
  OR?: [{ customer: { contains: string } }, ...unknown[]];
};
type FindManyArgs = {
  where?: WhereArg;
  orderBy: Record<string, 'asc' | 'desc'>;
  skip: number;
  take: number;
};

function makePrismaMock(rows: PrismaOrder[]) {
  const applyWhere = (where?: WhereArg) =>
    rows.filter((r) => {
      if (where?.status && r.status !== where.status) return false;
      if (where?.OR) {
        const q = where.OR[0].customer.contains.toLowerCase();
        const hit = r.customer.toLowerCase().includes(q) || r.email.toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });

  return {
    order: {
      findMany: jest.fn(async ({ where, orderBy, skip, take }: FindManyArgs) => {
        const [field, dir] = Object.entries(orderBy)[0] as [keyof PrismaOrder, 'asc' | 'desc'];
        const filtered = applyWhere(where).sort((a, b) => {
          const av = a[field] as never;
          const bv = b[field] as never;
          const cmp = av > bv ? 1 : av < bv ? -1 : 0;
          return dir === 'asc' ? cmp : -cmp;
        });
        return filtered.slice(skip, skip + take);
      }),
      count: jest.fn(async ({ where }: { where?: WhereArg }) => applyWhere(where).length),
    },
  };
}

async function createService(rows: PrismaOrder[]) {
  const prisma = makePrismaMock(rows);
  const moduleRef = await Test.createTestingModule({
    providers: [OrdersService, { provide: PrismaService, useValue: prisma }],
  }).compile();
  return moduleRef.get(OrdersService);
}

const baseQuery: OrdersQuery = { page: 1, limit: 10, sort: 'date:desc' };

describe('OrdersService.findAll (server-side pagination)', () => {
  it('returns a full page and a meta.total covering the WHOLE dataset, not the page', async () => {
    const service = await createService(buildOrders(25));

    const res = await service.findAll({ ...baseQuery, page: 1, limit: 10 });

    expect(res.data).toHaveLength(10);
    expect(res.meta.total).toBe(25); // real DB total — the UI counter depends on this
    expect(res.meta.totalPages).toBe(3);
  });

  it('returns the remainder on the last page (limit boundary)', async () => {
    const service = await createService(buildOrders(25));

    const res = await service.findAll({ ...baseQuery, page: 3, limit: 10 });

    expect(res.data).toHaveLength(5);
    expect(res.meta.total).toBe(25);
  });

  it('does not leak rows past the last page', async () => {
    const service = await createService(buildOrders(25));

    const res = await service.findAll({ ...baseQuery, page: 4, limit: 10 });

    expect(res.data).toHaveLength(0);
  });

  it('applies the status filter to both data and total', async () => {
    const service = await createService(buildOrders(25)); // 5 PENDING (i % 5 === 0)

    const res = await service.findAll({ ...baseQuery, status: 'pending', limit: 10 });

    expect(res.meta.total).toBe(5);
    expect(res.data.every((o) => o.status === 'pending')).toBe(true);
  });

  it('applies the search filter to both data and total', async () => {
    const service = await createService(buildOrders(25)); // 13 "Alice" (even indexes)

    const res = await service.findAll({ ...baseQuery, search: 'alice', limit: 10 });

    expect(res.meta.total).toBe(13);
    expect(res.data.every((o) => o.customer === 'Alice')).toBe(true);
  });
});
