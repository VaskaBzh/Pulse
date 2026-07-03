import { OrderSchema, PaginatedResponseSchema, type PaginatedResponse } from '@pulse/contracts';
import type { Order } from './model';
import { apiRequest } from '../../shared/api/httpClient';

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
  const query = new URLSearchParams();
  query.set('page', String(params.page ?? 1));
  query.set('limit', String(params.limit ?? 10));
  if (params.sort) query.set('sort', params.sort);
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);

  return apiRequest(`/orders?${query.toString()}`, PaginatedResponseSchema(OrderSchema));
}
