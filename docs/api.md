[← Architecture](architecture.md) · [Back to README](../README.md) · [Components →](components.md)

# API Reference

Backend: NestJS (`apps/api`), PostgreSQL via Prisma. Base URL: `http://localhost:3000/api` in development (`VITE_API_URL` on the frontend, `CORS_ORIGIN` on the backend — see [Getting Started](getting-started.md)). Interactive Swagger UI at `/api/docs`.

Every request/response shape is defined once in `packages/contracts` as a Zod schema and imported by both apps — the frontend validates responses against the exact schema the backend uses to validate requests.

---

## Endpoints

| Method & Path | Query params | Response |
|---|---|---|
| `GET /metrics` | `range=7d\|30d\|90d` (default `30d`) | `DailyMetric[]` |
| `GET /traffic-sources` | — | `TrafficSource[]` |
| `GET /orders` | `status`, `page`, `limit` (max 100), `sort`, `search` | `PaginatedResponse<Order>` — `{ data, meta: { page, limit, total, totalPages } }` |
| `GET /customers` | — | `Customer[]` |
| `GET /products` | — | `Product[]` |
| `GET /analytics/funnel` | — | `FunnelStep[]` |
| `GET /analytics/retention` | — | `RetentionRow[]` |
| `GET /health` | — | `{ status: 'ok', timestamp, uptime }` |

Invalid query params return `400` with a Zod issue list; unexpected errors are handled by `GlobalExceptionFilter`.

---

## Shared Contracts (`packages/contracts`)

| Schema | Shape |
|---|---|
| `DailyMetricSchema` | `date, revenue, profit, orders, users, sessions, conversionRate, avgOrderValue` |
| `OrderSchema` | `id, customer, email, product, amount, status, date, country` |
| `ProductSchema` | `id, name, category, revenue, orders, growth` |
| `CustomerSchema` | `id, name, email, segment, ltv, joinDate, country, orders` |
| `TrafficSourceSchema` | `name, value, color` |
| `FunnelStepSchema` | `label, value, conversionRate` |
| `RetentionRowSchema` | `cohort, weeks[]` |
| `PaginatedResponseSchema(itemSchema)` | `{ data: itemSchema[], meta: { page, limit, total, totalPages } }` |

## Frontend Consumption

`apps/web/src/shared/api/httpClient.ts` exposes `apiRequest<T>(path, schema, init?)` — a typed `fetch` wrapper that:
- builds the URL from `VITE_API_URL`
- throws `ApiError` on a non-2xx response
- parses the JSON body and validates it with the given Zod schema, throwing `ApiError` on a mismatch

Each file in `shared/api/` (`metrics.ts`, `orders.ts`, `customers.ts`, `products.ts`) wraps one or more endpoints with `apiRequest` and the matching contract schema. `fetchOrders()` requests `limit=100` and unwraps `.data` — the current order volume fits in one page; a `console.warn` fires if `meta.total` ever exceeds the limit, signaling it's time to move `OrdersPage` to server-side pagination.

## See Also

- [Architecture](architecture.md) — full directory structure for both apps
- [State Management](state-management.md) — how fetched data flows into `dashboardStore` and TanStack Query
