[← Architecture](architecture.md) · [Back to README](../README.md) · [State Management →](state-management.md)

# Components

---

## Layout (`shared/components/layout/`)

### Sidebar

Navigation panel with collapse support.

- Width: 240px (expanded) / 68px (collapsed)
- Toggle button `‹ ›` calls `toggleSidebar()` in the store
- Collapsed state shows icons + tooltip on hover
- Active page highlighted via `activePage` from store

### TopBar

Top control bar.

- Period switcher **7D / 30D / 90D** → calls `setDateRange()`
- Theme toggle ☀ / 🌙 → calls `toggleTheme()`
- **Export CSV** button → calls `useExport()`

---

## UI (`shared/components/ui/`)

### KPICard

Metric card with sparkline and period comparison.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Metric label |
| `value` | `string` | Formatted value |
| `change` | `number` | % change — positive → green, negative → red |
| `sparklineData` | `number[]` | Last 14 values for the mini chart |
| `icon` | `ReactNode` | Icon from lucide-react |
| `color` | `string` | HEX accent color |

Sparkline is a Recharts `<LineChart>` with no axes.

### Modal

Accessible dialog with focus trap and Escape key close.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `isOpen` | `boolean` | Controls visibility |
| `onClose` | `() => void` | Close handler |
| `title` | `string` | Dialog title |
| `children` | `ReactNode` | Dialog content |

- Sets `document.body.style.overflow = 'hidden'` when open
- `role="dialog"`, `aria-labelledby` for accessibility
- Keyboard: Escape closes the modal

### Popover

Toggleable floating panel.

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `trigger` | `ReactNode` | Element that opens the popover |
| `children` | `ReactNode` | Popover content |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | Position relative to trigger |

- Click outside closes the popover
- Cleans up event listeners on unmount

---

## Charts (`features/dashboard/components/charts/`)

All charts use Recharts `<ResponsiveContainer width="100%" height={N}>`.

### RevenueAreaChart

- Type: `AreaChart` with gradient fill
- Data: `filteredMetrics` → `revenue` and `profit` fields
- Two series: Revenue (indigo `#6366f1`) and Profit (emerald `#10b981`)
- Custom tooltip showing date and formatted values
- Y-axis formatted as `$Xk`

### OrdersBarChart

- Type: `BarChart`, `barSize={6}`, `radius={[3,3,0,0]}`
- Data: `filteredMetrics` → `orders` field
- Color: emerald `#10b981`

### TrafficDonutChart

- Type: `PieChart` with `innerRadius` (donut)
- Data: `trafficSources` from `mockData.ts` (static)
- 5 sources: Organic, Direct, Referral, Social, Email
- Custom legend with color dot markers

---

## Tables (`features/dashboard/components/tables/`)

### RecentOrdersTable

Last 10 orders from `recentOrders` (mockData).

**Columns:** ID, Customer, Product, Amount, Status, Date, Country

**Status badge colors:**

| Status | Color |
|--------|-------|
| `completed` | green |
| `pending` | yellow |
| `cancelled` | red |
| `refunded` | gray |

### TopProductsTable

Top 6 products by revenue from `topProducts` (mockData).

**Columns:** Product, Category, Revenue (progress bar), Orders, Growth (%)

---

## Adding a new component

1. Place the file in the appropriate directory:
   - Reusable primitive → `shared/components/ui/`
   - Page-specific → `features/<page>/components/`
2. Use named export: `export function MyComponent() {}`
3. Read store data with a granular selector:
   ```tsx
   const data = useDashboardStore((s) => s.filteredMetrics);
   ```
4. Use `clsx` for conditional classes:
   ```tsx
   import clsx from 'clsx';
   className={clsx('base-class', condition && 'conditional-class')}
   ```

---

## See Also

- [State Management](state-management.md) — how components read from the store
- [Architecture](architecture.md) — dependency rules between layers
