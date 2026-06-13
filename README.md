# Pulse — Analytics Dashboard

[![CI](https://github.com/VaskaBzh/Pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/VaskaBzh/Pulse/actions/workflows/ci.yml)

Профессиональный SaaS-дашборд для аналитики метрик интернет-магазина / контент-платформы.

> **Live Demo:** _deploy preview появится после подключения Vercel (см. [secrets setup](#deploy-preview-setup))_

## Стек технологий

| Слой | Технология |
|---|---|
| UI-фреймворк | React 19 + TypeScript |
| Сборщик | Vite 8 |
| Стили | Tailwind CSS v4 (class-based dark mode) |
| Графики | Recharts 2 |
| Состояние | Zustand 5 |
| Даты | date-fns |
| Иконки | lucide-react |
| Утилиты | clsx |

---

## Быстрый старт

```bash
# 1. Установить зависимости
npm install

# 2. Запустить dev-сервер
npm run dev

# 3. Открыть в браузере
# http://localhost:5173
```

### Production-сборка

```bash
npm run build      # tsc + Vite bundle → dist/
npm run preview    # preview собранного dist/
```

---

## Что умеет приложение

### Метрики (KPI-карточки)
- **Total Revenue** — суммарная выручка за период со сравнением с предыдущим
- **Total Orders** — количество заказов + процент изменения
- **Active Users** — уникальные пользователи
- **Conversion Rate** — % конверсии (заказы / сессии)
- **Avg. Order Value** — средний чек
- **Sessions** — общее число сессий
- Каждая карточка содержит **sparkline** (мини-график последних 14 дней) со своим цветом

### Графики
| График | Тип | Данные |
|---|---|---|
| Revenue & Profit | AreaChart с gradient-fill | Ежедневная выручка + прибыль |
| Traffic Sources | DonutChart | 5 источников трафика (%) |
| Daily Orders | BarChart | Объём заказов per day |

### Таблицы
- **Recent Orders** — последние 10 транзакций с цветными статус-бейджами (completed / pending / cancelled / refunded)
- **Top Products** — топ-6 продуктов по выручке с прогресс-барами и % роста

### Фильтр по дате
Кнопки в TopBar: **7D / 30D / 90D** — фильтруют все метрики и графики.
При смене периода автоматически пересчитываются KPI-показатели и % изменения
(текущий период сравнивается с предыдущим периодом такой же длины).

### Тёмная / светлая тема
Кнопка ☀ / 🌙 в правом верхнем углу. Состояние хранится в Zustand-сторе.
По умолчанию — тёмная тема.

### Экспорт в CSV
Кнопка **Export CSV** — скачивает файл `pulse-analytics-<period>-<date>.csv`
Содержит: Date, Revenue, Profit, Orders, Users, Sessions, Conv. Rate, AOV.

### Сворачиваемый сайдбар
Кнопка `‹ ›` на боковой панели — сжимает сайдбар до иконок (240px → 68px).

---

## Структура проекта

```
src/
├── types/
│   └── index.ts              — TypeScript-интерфейсы (DailyMetric, Order, Product…)
├── data/
│   └── mockData.ts           — Генератор 90 дней реалистичных данных
├── store/
│   └── dashboardStore.ts     — Zustand-стор (тема, фильтр, вычисленные метрики)
├── hooks/
│   └── useExport.ts          — Хук для экспорта CSV
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx       — Навигационная панель
│   │   └── TopBar.tsx        — Верхняя панель (фильтры, экспорт, тема)
│   ├── ui/
│   │   └── KPICard.tsx       — Карточка метрики со sparkline
│   ├── charts/
│   │   ├── RevenueAreaChart.tsx   — AreaChart Revenue + Profit
│   │   ├── TrafficDonutChart.tsx  — DonutChart источников трафика
│   │   └── OrdersBarChart.tsx     — BarChart Daily Orders
│   └── tables/
│       ├── RecentOrdersTable.tsx  — Таблица последних заказов
│       └── TopProductsTable.tsx   — Топ-продукты с прогресс-барами
├── pages/
│   └── Dashboard.tsx         — Главная страница (компоновка всех блоков)
├── App.tsx                   — Root: Layout + синхронизация темы с DOM
├── main.tsx                  — Entry point, инициализация dark-класса
└── index.css                 — Tailwind v4 + @custom-variant dark
```

---

## Как работает архитектура

### Состояние (Zustand)

```typescript
// store/dashboardStore.ts
const store = {
  theme: 'dark',            // светлая / тёмная тема
  dateRange: '30d',         // активный фильтр периода

  // Вычисляемые поля (пересчитываются при смене dateRange):
  filteredMetrics: [...],   // срез allMetrics за выбранный период
  summaryStats: { ... },    // KPI с % изменением vs предыдущий период
}
```

При вызове `setDateRange('7d')` стор срезает данные и пересчитывает все статистики —
компоненты подписываются напрямую на `filteredMetrics` и `summaryStats` и re-render'ятся автоматически.

### Данные

`generateDailyMetrics(90)` создаёт 90 дней синтетических данных с:
- Детерминированным псевдослучайным числом (sin-seed) — одинаковые данные при каждом запуске
- Недельной сезонностью (+28% в выходные дни)
- Восходящим трендом роста (+0.25%/день)

### Dark mode (Tailwind v4)

```css
/* index.css */
@custom-variant dark (&:where(.dark, .dark *));
```

Класс `dark` ставится на `<html>` через Zustand-экшен `toggleTheme()` —
все дочерние элементы реагируют на `dark:` утилиты Tailwind.

---

## Как тестировать функционал

| Действие | Что проверить |
|---|---|
| Кликнуть **7D** | KPI-значения уменьшатся, графики покажут 7 дней |
| Кликнуть **90D** | Графики расширятся до 3 месяцев с прореженными тиками |
| Нажать ☀ в TopBar | Тема переключится на светлую (светлый фон + серый сайдбар) |
| Нажать **Export CSV** | Скачается .csv файл с данными за выбранный период |
| Нажать `‹` на сайдбаре | Сайдбар сожмётся до иконок, наведение покажет tooltip |
| Навести на линию графика | Кастомный tooltip с датой и значениями Revenue / Profit |
| Навести на бар в Orders | Tooltip с количеством заказов за день |
| Кликнуть по секции Donut | Tooltip с процентом источника трафика |
| Навести на строку таблицы | Highlight-эффект на всю строку |

---

## Расширение (идеи для следующего шага)

- **Реальный API** — заменить `mockData.ts` на fetch/SWR-запросы
- **React Router** — роутинг для страниц Analytics, Orders, Products
- **Дополнительные графики** — Heatmap по часам, Funnel-диаграмма
- **Фильтры** — по категории, стране, каналу трафика
- **localStorage persist** — сохранять тему через Zustand persist middleware
- **Анимация чисел** — counter animation при смене периода

---

## Документация

| Раздел | Описание |
|--------|---------|
| [Начало работы](docs/getting-started.md) | Установка, запуск, тестирование функционала |
| [Архитектура](docs/architecture.md) | Структура проекта, Structured Modules, правила зависимостей |
| [Компоненты](docs/components.md) | KPICard, графики, таблицы, layout |
| [State Management](docs/state-management.md) | Zustand store, селекторы, типы данных |
| [Git Workflow](docs/git-workflow.md) | Git flow, conventional commits, GitHub MCP |
