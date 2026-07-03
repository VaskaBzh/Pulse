import { OrderSchema, PaginatedResponseSchema } from '@pulse/contracts';
import type { Order } from './model';
import { apiRequest } from '../../shared/api/httpClient';
import { logger } from '../../shared/lib/logger';

const FETCH_LIMIT = 100;

export async function fetchOrders(): Promise<Order[]> {
  const paginated = await apiRequest(
    `/orders?limit=${FETCH_LIMIT}&page=1`,
    PaginatedResponseSchema(OrderSchema),
  );

  if (paginated.meta.total > paginated.meta.limit) {
    logger.warn(
      `[api/orders] meta.total (${paginated.meta.total}) exceeds fetch limit (${paginated.meta.limit}) — some orders are not shown; migrate to server-side pagination`,
    );
  }

  return paginated.data;
}
