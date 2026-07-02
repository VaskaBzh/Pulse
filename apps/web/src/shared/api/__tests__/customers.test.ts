import { describe, it, expect, afterEach, vi } from 'vitest';
import { fetchCustomers } from '../customers';

describe('customers api', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses an array of customers', async () => {
    const customer = {
      id: '1',
      name: 'Acme Inc',
      email: 'ops@acme.test',
      segment: 'Enterprise' as const,
      ltv: 12000,
      joinDate: '2025-01-01',
      country: 'US',
      orders: 42,
    };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => [customer],
        text: async () => '',
      }),
    );

    const result = await fetchCustomers();

    expect(result).toEqual([customer]);
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/customers'), expect.any(Object));
  });
});
