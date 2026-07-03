import { describe, it, expect, afterEach, vi } from 'vitest';
import { fetchOrders } from '../orders';

const order = {
  id: '1',
  customer: 'Jane Doe',
  email: 'jane@example.com',
  product: 'Pro Plan',
  amount: 99,
  status: 'completed' as const,
  date: '2026-01-01',
  country: 'US',
};

function mockPaginatedResponse(data: unknown[], meta: Partial<Record<string, number>> = {}) {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({
      data,
      meta: { page: 1, limit: 10, total: data.length, totalPages: 1, ...meta },
    }),
    text: async () => '',
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function requestedPath(fetchMock: ReturnType<typeof vi.fn>): string {
  return String(fetchMock.mock.calls[0][0]);
}

describe('orders api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the full paginated response (data + meta)', async () => {
    mockPaginatedResponse([order], { total: 42, totalPages: 5 });

    const result = await fetchOrders();

    expect(result.data).toEqual([order]);
    expect(result.meta.total).toBe(42);
    expect(result.meta.totalPages).toBe(5);
  });

  it('defaults to page=1 and limit=10', async () => {
    const fetchMock = mockPaginatedResponse([]);

    await fetchOrders();

    const path = requestedPath(fetchMock);
    expect(path).toContain('page=1');
    expect(path).toContain('limit=10');
  });

  it('forwards pagination, sort, search and status to the server', async () => {
    const fetchMock = mockPaginatedResponse([]);

    await fetchOrders({
      page: 3,
      limit: 25,
      sort: 'amount:asc',
      search: 'jane',
      status: 'pending',
    });

    const path = requestedPath(fetchMock);
    expect(path).toContain('page=3');
    expect(path).toContain('limit=25');
    expect(path).toContain('sort=amount%3Aasc');
    expect(path).toContain('search=jane');
    expect(path).toContain('status=pending');
  });

  it('omits optional params when not provided (no client-side filtering)', async () => {
    const fetchMock = mockPaginatedResponse([]);

    await fetchOrders({ page: 1 });

    const path = requestedPath(fetchMock);
    expect(path).not.toContain('search=');
    expect(path).not.toContain('status=');
  });
});
