[← Components](components.md) · [Back to README](../README.md) · [Git Workflow →](git-workflow.md)

# State Management

---

## Zustand Store

File: `apps/web/src/shared/store/dashboardStore.ts`

### Structure

```typescript
interface DashboardStore {
  // UI state
  theme: Theme;             // 'light' | 'dark'
  sidebarOpen: boolean;
  dateRange: DateRange;     // '7d' | '30d' | '90d'

  // Raw data, populated asynchronously (see "Loading real data" below)
  rawMetrics: DailyMetric[];

  // Derived data (recomputed on every setDateRange / setRawMetrics call)
  filteredMetrics: DailyMetric[];
  summaryStats: SummaryStats;

  // Actions
  toggleTheme: () => void;
  setDateRange: (range: DateRange) => void;
  setRawMetrics: (metrics: DailyMetric[]) => void;
  toggleSidebar: () => void;
}
```

### Loading real data

The store itself never fetches — `Dashboard.tsx` fetches once via TanStack Query and pushes the result in:

```tsx
const { data: metrics } = useQuery({
  queryKey: ['metrics', '90d'],
  queryFn: () => fetchMetrics('90d'),
  throwOnError: true, // routes failures to the page-level ErrorBoundary
});

useEffect(() => {
  if (metrics) setRawMetrics(metrics);
}, [metrics]);
```

It always requests the full **90-day** window regardless of the UI-selected period — `summaryStats` compares the current period against an equally long *previous* period, which needs 2× the longest selectable range. Switching between 7d/30d/90d in the UI is then a pure client-side slice with no extra request.

### How filtering works

When `setDateRange('7d')` is called:

```
rawMetrics (90 days, from setRawMetrics)
  ├── current = last 7 days
  └── prev    = previous 7 days

summaryStats = computeStats(current, prev)
  → revenue.change = ((current - prev) / prev) * 100
```

Components subscribed to `filteredMetrics` or `summaryStats` re-render automatically. Before the first fetch resolves, `rawMetrics` is `[]` and `filteredMetrics`/`summaryStats` are correspondingly empty/zeroed — `Dashboard.tsx` shows `PageSkeleton` while `isLoading` is true.

### Usage patterns

**Granular selector (recommended):**
```tsx
const filteredMetrics = useDashboardStore((s) => s.filteredMetrics);
const summaryStats    = useDashboardStore((s) => s.summaryStats);
```

**Multiple fields (shallow):**
```tsx
import { useShallow } from 'zustand/react/shallow';

const { theme, toggleTheme } = useDashboardStore(
  useShallow((s) => ({ theme: s.theme, toggleTheme: s.toggleTheme }))
);
```

**Action without subscribing to state:**
```tsx
const setDateRange = useDashboardStore((s) => s.setDateRange);
```

**Avoid:**
```tsx
// ❌ Subscribes to entire store — re-renders on any change
const store = useDashboardStore();
```

---

## React Query

File: `apps/web/src/shared/api/`

Each page fetches its data via TanStack Query v5, calling the real backend through `shared/api/*.ts` fetchers (see [API Reference](api.md) for the full endpoint/schema list).

**Example (OrdersPage):**
```tsx
const { data: orders, isLoading } = useQuery({
  queryKey: ['orders'],
  queryFn: fetchOrders,
});
```

`QueryClient` is configured in `apps/web/src/queryClient.ts` with:
- `staleTime: 30_000` (30 seconds)
- `retry: 1`

---

## Forms (React Hook Form + Zod)

File: `src/shared/lib/validation.ts`

Zod schemas used across the app:

| Schema | Used in |
|--------|---------|
| `dateRangeSchema` | DateRange type guard |
| `orderStatusSchema` | Orders status filter |
| `ordersFilterSchema` | OrdersFilters form |
| `reportExportSchema` | ReportsPage export form |

**Example (ReportsPage):**
```tsx
const form = useForm<ReportExportValues>({
  resolver: zodResolver(reportExportSchema),
});
```

---

## Export Hook

File: `apps/web/src/shared/hooks/useExport.ts`

```tsx
const { exportData } = useExport();

exportData('csv');   // downloads pulse-analytics-<period>-<date>.csv
exportData('json');  // downloads pulse-analytics-<period>-<date>.json
```

CSV fields: Date, Revenue, Profit, Orders, Users, Sessions, Conv. Rate, AOV.

---

## Types

File: `apps/web/src/shared/types/index.ts`

Data-model types are re-exported from `@pulse/contracts` (single source of truth shared with the backend); UI-only types are declared locally.

| Type | Source | Description |
|------|--------|-------------|
| `DailyMetric` | `@pulse/contracts` | Daily metrics (revenue, profit, orders, users, sessions…) |
| `Order` | `@pulse/contracts` | Order with customer, amount, status, date, country |
| `Product` | `@pulse/contracts` | Product with name, category, revenue, orders, growth |
| `Customer` | `@pulse/contracts` | Customer with segment, ltv, joinDate, country |
| `TrafficSource` | `@pulse/contracts` | Traffic source with name, value, color |
| `FunnelStep` | `@pulse/contracts` | Funnel step with label, value, conversionRate |
| `RetentionRow` | `@pulse/contracts` | Retention cohort with weeks[] |
| `SummaryStats` | local | KPI object with current/prev/change per metric |
| `DateRange` | local | `'7d' \| '30d' \| '90d'` |
| `Theme` | local | `'light' \| 'dark'` |

---

## See Also

- [Components](components.md) — how components subscribe to the store
- [Architecture](architecture.md) — layer structure and dependency rules
- [API Reference](api.md) — endpoints and schemas behind these fetchers
