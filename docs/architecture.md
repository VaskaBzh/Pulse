[← Getting Started](getting-started.md) · [Back to README](../README.md) · [Components →](components.md)

# Architecture

Pattern: **Feature-based modules** (`src/features/` + `src/shared/`).

---

## Directory Structure

```
src/
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
│   │   └── DashboardPage.tsx
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
│   ├── api/                         — React Query fetchers (mock API layer)
│   │   ├── metrics.ts
│   │   ├── orders.ts
│   │   ├── customers.ts
│   │   └── products.ts
│   ├── components/
│   │   ├── layout/                  — Sidebar, TopBar (app shell)
│   │   └── ui/                      — KPICard, Modal, Popover
│   ├── data/
│   │   └── mockData.ts              — deterministic 90-day data generator
│   ├── hooks/
│   │   └── useExport.ts             — CSV/JSON export hook
│   ├── lib/
│   │   └── validation.ts            — Zod schemas (dateRange, orderStatus, filters)
│   ├── store/
│   │   └── dashboardStore.ts        — Zustand store (theme, dateRange, computed stats)
│   └── types/
│       └── index.ts                 — shared TypeScript interfaces
├── App.tsx                          — router + layout shell
└── main.tsx                         — entry point, dark class init
```

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

Mock API layer built on TanStack Query. Each file exports `useQuery`-compatible fetcher functions that simulate network delay (`randomDelay 200–400ms`). Replacing mock data with real endpoints means changing only these files.

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

- [Components](components.md) — component API and implementation details
- [State Management](state-management.md) — store structure and React Query patterns
