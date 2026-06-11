[← Компоненты](components.md) · [Back to README](../README.md)

# State Management

Zustand v5 — единый store для всего приложения.

## Store: `dashboardStore`

Файл: `src/store/dashboardStore.ts`

### Структура

```typescript
interface DashboardStore {
  // Состояние UI
  theme: Theme;            // 'light' | 'dark'
  sidebarOpen: boolean;    // развёрнут ли сайдбар
  activePage: string;      // активная страница навигации
  dateRange: DateRange;    // '7d' | '30d' | '90d'

  // Вычисляемые данные (пересчитываются при смене dateRange)
  filteredMetrics: DailyMetric[];  // срез allMetrics за выбранный период
  summaryStats: SummaryStats;      // KPI с % изменением vs предыдущий период

  // Экшены
  toggleTheme: () => void;
  setDateRange: (range: DateRange) => void;
  toggleSidebar: () => void;
  setActivePage: (page: string) => void;
}
```

### Как работает фильтрация

При вызове `setDateRange('7d')`:

```
allMetrics (90 дней)
  ├── current = последние 7 дней
  └── prev = предыдущие 7 дней

summaryStats = computeStats(current, prev)
  → revenue.change = ((current - prev) / prev) * 100
```

Компоненты подписываются на `filteredMetrics` и `summaryStats` — ре-рендер происходит автоматически.

## Паттерны использования

### Гранулярный селектор (рекомендуется)

```tsx
// Компонент перерендерится только при изменении filteredMetrics
const filteredMetrics = useDashboardStore((s) => s.filteredMetrics);
const summaryStats = useDashboardStore((s) => s.summaryStats);
```

### Несколько полей (shallow)

```tsx
import { useShallow } from 'zustand/react/shallow';

const { theme, toggleTheme } = useDashboardStore(
  useShallow((s) => ({ theme: s.theme, toggleTheme: s.toggleTheme }))
);
```

### Экшен без подписки на состояние

```tsx
// Компонент не будет ре-рендерится при изменении store
const setDateRange = useDashboardStore((s) => s.setDateRange);
```

### Что не делать

```tsx
// ❌ Подписка на весь store — лишние ре-рендеры при любом изменении
const store = useDashboardStore();

// ❌ Вычисления в компоненте — они уже в store
const filtered = store.allMetrics.filter(...);
```

## Данные: `mockData.ts`

Файл: `src/data/mockData.ts`

| Экспорт | Тип | Описание |
|---------|-----|---------|
| `allMetrics` | `DailyMetric[]` | 90 дней ежедневных метрик |
| `recentOrders` | `Order[]` | Последние заказы |
| `topProducts` | `Product[]` | Топ-продукты |
| `trafficSources` | `TrafficSource[]` | Источники трафика (статичные) |

### Генерация данных

`allMetrics` генерируется детерминированно:
- **Seed**: `sin(i) * 10000 - Math.floor(sin(i) * 10000)` — одинаковые данные каждый раз
- **Сезонность**: +28% в выходные дни
- **Тренд**: +0.25%/день роста выручки

## Типы: `src/types/index.ts`

| Тип | Описание |
|-----|---------|
| `DailyMetric` | Ежедневные метрики (revenue, orders, users, sessions…) |
| `SummaryStats` | KPI-объект с current/prev/change для каждой метрики |
| `Order` | Заказ с customer, amount, status, date, country |
| `Product` | Продукт с name, category, revenue, orders, growth |
| `TrafficSource` | Источник трафика с name, value, color |
| `DateRange` | `'7d' \| '30d' \| '90d'` |
| `Theme` | `'light' \| 'dark'` |

## Хук useExport

Файл: `src/hooks/useExport.ts`

```tsx
const { exportCSV } = useExport();
// Скачивает pulse-analytics-<period>-<date>.csv
// Содержит: Date, Revenue, Profit, Orders, Users, Sessions, ConvRate, AOV
```

## See Also

- [Компоненты](components.md) — как компоненты подписываются на store
- [Начало работы](getting-started.md) — запуск и тестирование
