import type { z } from 'zod/v4';
import { logger } from '../lib/logger';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`ApiError: ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export async function apiRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const method = init?.method ?? 'GET';

  logger.debug(`[httpClient] → ${method} ${url}`);

  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });

  if (!res.ok) {
    const body = await res.text();
    logger.error(`[httpClient] ✗ ${res.status} ${url}`, body);
    throw new ApiError(res.status, body);
  }

  const json = await res.json();
  const parsed = schema.safeParse(json);

  if (!parsed.success) {
    logger.error(`[httpClient] ✗ schema validation failed for ${url}`, parsed.error.issues);
    throw new ApiError(0, parsed.error.issues);
  }

  logger.debug(`[httpClient] ← ${res.status} ${url}`);
  return parsed.data;
}
