[← Архитектура](architecture.md) · [Back to README](../README.md) · [State Management →](state-management.md)

# Компоненты

## Layout

### Sidebar (`components/layout/Sidebar.tsx`)

Боковая навигационная панель с коллапсом.

- Ширина: 240px (развёрнут) / 68px (свёрнут)
- Кнопка `‹ ›` переключает `sidebarOpen` в store
- В свёрнутом виде показывает иконки + tooltip при наведении
- Активная страница подсвечивается через `activePage` из store

### TopBar (`components/layout/TopBar.tsx`)

Верхняя панель с управлением.

- Переключатель периода: **7D / 30D / 90D** → вызывает `setDateRange()`
- Кнопка темы: ☀ / 🌙 → вызывает `toggleTheme()`
- Кнопка **Export CSV** → вызывает `useExport()`

---

## UI

### KPICard (`components/ui/KPICard.tsx`)

Карточка ключевой метрики.

**Props:**

| Prop | Тип | Описание |
|------|-----|---------|
| `title` | `string` | Название метрики |
| `value` | `string` | Форматированное значение |
| `change` | `number` | % изменение (+ зелёный, − красный) |
| `sparklineData` | `number[]` | Последние 14 значений для мини-графика |
| `icon` | `ReactNode` | Иконка из lucide-react |
| `color` | `string` | HEX-цвет акцента |

Sparkline рисуется через Recharts `<LineChart>` без осей.

---

## Графики (`components/charts/`)

Все графики используют Recharts `<ResponsiveContainer width="100%" height={N}>`.

### RevenueAreaChart

- Тип: `AreaChart` с gradient-fill
- Данные: `filteredMetrics` → поля `revenue` и `profit`
- Два ряда: Revenue (indigo `#6366f1`) и Profit (emerald `#10b981`)
- Кастомный tooltip с датой и значениями
- Ось Y форматируется как `$Xk`

### OrdersBarChart

- Тип: `BarChart`, `barSize={6}`, `radius={[3,3,0,0]}`
- Данные: `filteredMetrics` → поле `orders`
- Цвет: emerald `#10b981`

### TrafficDonutChart

- Тип: `PieChart` с `innerRadius` (donut)
- Данные: `trafficSources` из `mockData.ts` (статичные)
- 5 источников: Organic, Direct, Referral, Social, Email
- Кастомная легенда сбоку с цветными dot-маркерами

---

## Таблицы (`components/tables/`)

### RecentOrdersTable

Последние 10 заказов из `recentOrders` (mockData).

**Колонки:** ID, Customer, Product, Amount, Status, Date, Country

**Статусы с цветами:**

| Статус | Цвет |
|--------|------|
| `completed` | зелёный |
| `pending` | жёлтый |
| `cancelled` | красный |
| `refunded` | серый |

### TopProductsTable

Топ-6 продуктов по выручке из `topProducts` (mockData).

**Колонки:** Product, Category, Revenue (прогресс-бар), Orders, Growth (%)

---

## Как добавить новый компонент

1. Создай файл в нужной директории (`components/ui/`, `components/charts/` и т.д.)
2. Используй именованный экспорт: `export function MyComponent() {}`
3. Читай данные из store через гранулярный селектор:
   ```tsx
   const data = useDashboardStore((s) => s.filteredMetrics);
   ```
4. Используй `clsx` для условных классов:
   ```tsx
   import clsx from 'clsx';
   className={clsx('base-class', condition && 'conditional-class')}
   ```

## See Also

- [State Management](state-management.md) — как компоненты читают данные из store
- [Архитектура](architecture.md) — правила зависимостей между слоями
