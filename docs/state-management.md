[← Components](components.md) · [Back to README](../README.md) · [Git Workflow →](git-workflow.md)

# State Management

---

## Zustand Store

File: `src/shared/store/dashboardStore.ts`

### Structure

```typescript
interface DashboardStore {
  // UI state
  theme: Theme;             // 'light' | 'dark'
  sidebarOpen: boolean;
  activePage: string;
  dateRange: DateRange;     // '7d' | '30d' | '90d'

  // Derived data (recomputed on every setDateRange call)
  filteredMetrics: DailyMetric[];
  summaryStats: SummaryStats;

  // Actions
  toggleTheme: () => void;
  setDateRange: (range: DateRange) => void;
  toggleSidebar: () => void;
  setActivePage: (page: string) => void;
}
```

### How filtering works

When `setDateRange('7d')` is called:

```
allMetrics (90 days)
  ├── current = last 7 days
  └── prev    = previous 7 days

summaryStats = computeStats(current, prev)
  → revenue.change = ((current - prev) / prev) * 100
```

Components subscribed to `filteredMetrics` or `summaryStats` re-render automatically.

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

File: `src/shared/api/`

Each page fetches its data via TanStack Query v5. The mock API layer (`shared/api/*.ts`) simulates network delay (200–400ms random) so loading states are visible.

**Example (OrdersPage):**
```tsx
const { data: orders, isLoading } = useQuery({
  queryKey: ['orders'],
  queryFn: fetchOrders,
});
```

`QueryClient` is configured in `src/queryClient.ts` with:
- `staleTime: 30_000` (30 seconds)
- `retry: 1`

Replacing mock fetchers with real API calls requires changing only the `shared/api/` files.

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

## Mock Data

File: `src/shared/data/mockData.ts`

| Export | Type | Description |
|--------|------|-------------|
| `allMetrics` | `DailyMetric[]` | 90 days of daily metrics |
| `recentOrders` | `Order[]` | Recent order transactions |
| `topProducts` | `Product[]` | Top products by revenue |
| `trafficSources` | `TrafficSource[]` | Static traffic source breakdown |

`allMetrics` is generated deterministically:
- **Seed**: `sin(i) * 10000 − Math.floor(sin(i) * 10000)` — same values on every run
- **Seasonality**: +28% on weekends
- **Trend**: +0.25%/day revenue growth

---

## Export Hook

File: `src/shared/hooks/useExport.ts`

```tsx
const { exportData } = useExport();

exportData('csv');   // downloads pulse-analytics-<period>-<date>.csv
exportData('json');  // downloads pulse-analytics-<period>-<date>.json
```

CSV fields: Date, Revenue, Profit, Orders, Users, Sessions, Conv. Rate, AOV.

---

## Types

File: `src/shared/types/index.ts`

| Type | Description |
|------|-------------|
| `DailyMetric` | Daily metrics (revenue, profit, orders, users, sessions…) |
| `SummaryStats` | KPI object with current/prev/change per metric |
| `Order` | Order with customer, amount, status, date, country |
| `Product` | Product with name, category, revenue, orders, growth |
| `TrafficSource` | Traffic source with name, value, color |
| `DateRange` | `'7d' \| '30d' \| '90d'` |
| `Theme` | `'light' \| 'dark'` |

---

## See Also

- [Components](components.md) — how components subscribe to the store
- [Architecture](architecture.md) — layer structure and dependency rules
