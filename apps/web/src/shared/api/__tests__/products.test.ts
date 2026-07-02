import { describe, it, expect, afterEach, vi } from 'vitest';
import { fetchProducts, fetchFunnelData, fetchRetentionData } from '../products';

function mockJsonResponse(json: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => json,
      text: async () => '',
    }),
  );
}

describe('products api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetchProducts parses an array of products', async () => {
    const product = {
      id: '1',
      name: 'Pro Plan',
      category: 'Subscription',
      revenue: 5000,
      orders: 50,
      growth: 12,
    };
    mockJsonResponse([product]);

    const result = await fetchProducts();

    expect(result).toEqual([product]);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/products'), expect.any(Object));
  });

  it('fetchFunnelData parses an array of funnel steps', async () => {
    const step = { label: 'Visit', value: 1000, conversionRate: 100 };
    mockJsonResponse([step]);

    const result = await fetchFunnelData();

    expect(result).toEqual([step]);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/analytics/funnel'),
      expect.any(Object),
    );
  });

  it('fetchRetentionData parses an array of retention rows', async () => {
    const row = { cohort: '2026-01', weeks: [100, 80, 60] };
    mockJsonResponse([row]);

    const result = await fetchRetentionData();

    expect(result).toEqual([row]);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/analytics/retention'),
      expect.any(Object),
    );
  });
});
