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
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data,
        meta: { page: 1, limit: 100, total: data.length, totalPages: 1, ...meta },
      }),
      text: async () => '',
    }),
  );
}

describe('orders api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('unwraps .data from the paginated response', async () => {
    mockPaginatedResponse([order]);

    const result = await fetchOrders();

    expect(result).toEqual([order]);
  });

  it('requests with limit=100&page=1', async () => {
    mockPaginatedResponse([]);

    await fetchOrders();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/orders?limit=100&page=1'),
      expect.any(Object),
    );
  });

  it('warns when meta.total exceeds meta.limit', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockPaginatedResponse([order], { total: 150, limit: 100 });

    await fetchOrders();

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('exceeds fetch limit'));
    warnSpy.mockRestore();
  });

  it('does not warn when all orders fit within the limit', async () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    mockPaginatedResponse([order], { total: 1, limit: 100 });

    await fetchOrders();

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});
