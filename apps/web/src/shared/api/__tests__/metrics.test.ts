import { describe, it, expect, afterEach, vi } from 'vitest';
import { fetchMetrics, fetchTrafficSources } from '../metrics';

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

describe('metrics api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetchMetrics requests /metrics with the given range and returns parsed data', async () => {
    const metric = {
      date: '2026-01-01',
      revenue: 100,
      profit: 50,
      orders: 5,
      users: 10,
      sessions: 20,
      conversionRate: 2.5,
      avgOrderValue: 20,
    };
    mockJsonResponse([metric]);

    const result = await fetchMetrics('7d');

    expect(result).toEqual([metric]);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/metrics?range=7d'),
      expect.any(Object),
    );
  });

  it('fetchMetrics defaults to range=90d when called without arguments', async () => {
    mockJsonResponse([]);

    await fetchMetrics();

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/metrics?range=90d'),
      expect.any(Object),
    );
  });

  it('fetchTrafficSources parses an array of traffic sources', async () => {
    const source = { name: 'Direct', value: 42, color: '#6366f1' };
    mockJsonResponse([source]);

    const result = await fetchTrafficSources();

    expect(result).toEqual([source]);
  });
});
