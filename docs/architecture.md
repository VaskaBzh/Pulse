[← Getting Started](getting-started.md) · [Back to README](../README.md) · [API Reference →](api.md)

# Architecture

Monorepo (npm workspaces): `apps/web` (frontend) + `apps/api` (backend) + `packages/contracts` (shared Zod schemas).

Frontend pattern: **Feature-based modules** (`apps/web/src/features/` + `apps/web/src/shared/`).
Backend pattern: **one NestJS module per domain** (controller + service).

---

## Directory Structure

```
apps/web/src/
├── features/                        — one directory per route/page
│   ├── analytics/
│   │   ├── components/              — page-specific components
│   │   └── AnalyticsPage.tsx
│   ├── customers/
│   │   ├── components/
│   │   └── CustomersPage.tsx
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── charts/              — RevenueAreaChart, TrafficDonutChart, OrdersBarChart
│   │   │   └── tables/              — RecentOrdersTable, TopProductsTable
│   │   └── Dashboard.tsx
│   ├── orders/
│   │   ├── components/              — OrdersTable, OrdersFilters, OrderDetailModal
│   │   └── OrdersPage.tsx
│   ├── products/
│   │   ├── components/
│   │   └── ProductsPage.tsx
│   ├── reports/
│   │   ├── components/
│   │   └── ReportsPage.tsx
│   └── settings/
│       ├── components/
│       └── SettingsPage.tsx
├── shared/                          — cross-feature code only
│   ├── api/                         — API layer, validated against @pulse/contracts
│   │   ├── httpClient.ts            — typed fetch wrapper (ApiError, apiRequest<T>)
│   │   ├── metrics.ts
│   │   ├── orders.ts
│   │   ├── customers.ts
│   │   └── products.ts
│   ├── components/
│   │   ├── layout/                  — Sidebar, TopBar (app shell)
│   │   └── ui/                      — KPICard, Modal, Popover, ErrorBoundary, PageSkeleton
│   ├── hooks/
│   │   └── useExport.ts             — CSV/JSON export hook
│   ├── lib/
│   │   └── validation.ts            — Zod schemas (dateRange, orderStatus, filters)
│   ├── store/
│   │   └── dashboardStore.ts        — Zustand store (theme, dateRange, rawMetrics, computed stats)
│   └── types/
│       └── index.ts                 — re-exports data types from @pulse/contracts + local UI-only types
├── App.tsx                          — router + layout shell
└── main.tsx                         — entry point, dark class init

apps/api/src/                        — one module per domain
├── metrics/ orders/ products/ customers/ traffic/ analytics/ health/
│   └── (each: *.controller.ts, *.service.ts, *.module.ts)
├── prisma/                          — PrismaService (global module)
├── filters/                         — GlobalExceptionFilter
├── app.module.ts
└── main.ts                          — bootstrap, Swagger (/api/docs), CORS, global prefix "api"

packages/contracts/src/              — Zod schemas shared by both apps (single source of truth)
├── metrics.ts orders.ts products.ts customers.ts traffic.ts funnel.ts retention.ts
├── pagination.ts                    — PaginatedResponseSchema<T> factory
└── index.ts                         — barrel export
```

See [API Reference](api.md) for the full endpoint list.

---

## Dependency Rules

```
features/*  →  shared/*      ✓ allowed
features/*  →  features/*    ✗ forbidden (no cross-feature imports)
shared/*    →  features/*    ✗ forbidden
```

Features are independent slices. If two features need the same logic, it belongs in `shared/`.

---

## Layer Descriptions

### `features/`

Each feature directory owns:
- Its page component (`*Page.tsx`)
- Page-specific sub-components (`components/`)
- No own store or API — reads from `shared/`

Pages are lazy-loaded via `React.lazy` in `App.tsx` for code splitting.

### `shared/api/`

API layer consumed by TanStack Query. Each file exports fetcher functions that call the backend through `httpClient.ts` (typed `fetch` wrapper) and validate the response against the matching Zod schema from `@pulse/contracts` — an invalid or unexpected response shape throws `ApiError` instead of silently passing through bad data.

### `shared/store/`

Single Zustand store (`dashboardStore`) manages:
- UI state: theme, sidebarOpen, dateRange
- Derived data: `filteredMetrics` and `summaryStats` — recomputed on every `setDateRange` call

### `shared/components/`

- `layout/` — app shell components (Sidebar, TopBar). Imported only in `App.tsx`.
- `ui/` — primitive reusable components (KPICard, Modal, Popover). No business logic.

---

## Routing

React Router v6 with `createBrowserRouter`. All routes render inside `AppLayout` (Sidebar + TopBar). Pages are lazy-loaded:

```
/             → DashboardPage
/analytics    → AnalyticsPage
/orders       → OrdersPage
/customers    → CustomersPage
/products     → ProductsPage
/reports      → ReportsPage
/settings     → SettingsPage
```

---

## See Also

- [API Reference](api.md) — backend endpoints and shared contract schemas
- [Components](components.md) — component API and implementation details
- [State Management](state-management.md) — store structure and React Query patterns
