import { OrderSchema, PaginatedResponseSchema, type PaginatedResponse } from '@pulse/contracts';
import type { Order } from './model';
import { typedGet } from '../../shared/api/typedClient';

/**
 * Server-side orders query. The backend owns filtering, sorting and pagination
 * (`OrdersService.findAll`) and returns `meta.total/totalPages`, so the client
 * must NOT over-fetch and slice locally — that silently dropped rows past the
 * fetch limit and made UI counters diverge from the DB (audit finding B).
 */
export interface FetchOrdersParams {
  /** 1-based page index (matches the backend contract). */
  page?: number;
  limit?: number;
  /** `field:dir`, e.g. `date:desc`. Server whitelists the field. */
  sort?: string;
  search?: string;
  /** Omit for "all" — the backend treats an absent status as no filter. */
  status?: Order['status'];
}

export async function fetchOrders(
  params: FetchOrdersParams = {},
): Promise<PaginatedResponse<Order>> {
  return typedGet('/orders', PaginatedResponseSchema(OrderSchema), {
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    sort: params.sort,
    search: params.search,
    status: params.status,
  });
}
