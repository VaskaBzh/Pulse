import { describe, it, expect, afterEach, vi } from 'vitest';
import { z } from 'zod/v4';
import { apiRequest, ApiError } from '../httpClient';

const schema = z.object({ id: z.number(), name: z.string() });

function mockFetchOnce(response: { ok: boolean; status: number; json?: unknown; text?: string }) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: response.ok,
      status: response.status,
      json: async () => response.json,
      text: async () => response.text ?? '',
    }),
  );
}

describe('httpClient', () => {
  afterEach(() => {
    console.log('[test:httpClient] restoring fetch stub');
    vi.unstubAllGlobals();
  });

  it('returns validated data on a successful response', async () => {
    mockFetchOnce({ ok: true, status: 200, json: { id: 1, name: 'Alpha' } });

    const result = await apiRequest('/things/1', schema);

    expect(result).toEqual({ id: 1, name: 'Alpha' });
  });

  it('throws ApiError with response status when the HTTP response is not ok', async () => {
    mockFetchOnce({ ok: false, status: 404, text: 'Not Found' });

    await expect(apiRequest('/things/999', schema)).rejects.toMatchObject({
      status: 404,
    });
    await expect(apiRequest('/things/999', schema)).rejects.toBeInstanceOf(ApiError);
  });

  it('throws ApiError when the response body fails schema validation', async () => {
    mockFetchOnce({ ok: true, status: 200, json: { id: 'not-a-number' } });

    await expect(apiRequest('/things/1', schema)).rejects.toBeInstanceOf(ApiError);
  });
});
