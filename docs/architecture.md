[← Начало работы](getting-started.md) · [Back to README](../README.md) · [Компоненты →](components.md)

# Архитектура

Паттерн: **Structured Modules (по feature)**. Подробное описание — `.ai-factory/ARCHITECTURE.md`.

## Текущая структура

```
src/
├── components/
│   ├── layout/          # Sidebar, TopBar — переиспользуемый layout
│   ├── ui/              # KPICard и другие базовые компоненты
│   ├── charts/          # RevenueAreaChart, OrdersBarChart, TrafficDonutChart
│   └── tables/          # RecentOrdersTable, TopProductsTable
├── pages/
│   └── Dashboard.tsx    # Страница дашборда — компоновка блоков
├── store/
│   └── dashboardStore.ts # Zustand store: тема, период, метрики
├── hooks/
│   └── useExport.ts      # Хук экспорта CSV
├── data/
│   └── mockData.ts       # 90 дней синтетических данных
├── types/
│   └── index.ts          # Централизованные TypeScript типы
├── App.tsx               # Root: layout + синхронизация темы с DOM
└── main.tsx              # Entry point
```

## Целевая структура (при росте проекта)

```
src/
├── features/
│   ├── dashboard/        # Всё, что относится к дашборду
│   │   ├── components/   # charts/, tables/
│   │   ├── store/        # dashboardStore.ts
│   │   ├── hooks/        # useExport.ts
│   │   ├── Dashboard.tsx
│   │   └── index.ts      # export { Dashboard }
│   └── analytics/        # Будущий модуль (пример)
├── shared/
│   ├── components/       # layout/, ui/
│   ├── data/             # mockData.ts
│   └── types/            # index.ts
├── App.tsx
└── main.tsx
```

> Миграция не нужна прямо сейчас — текущая структура оптимальна для одного модуля.

## Правила зависимостей

```
features/X/  →  shared/          ✅ Можно
features/X/  →  features/Y/      ❌ Нельзя
shared/      →  features/X/      ❌ Нельзя
App.tsx      →  features/*/index ✅ Можно
```

## Ключевые соглашения

- **Именование компонентов:** PascalCase (`KPICard.tsx`, `RevenueAreaChart.tsx`)
- **Именование утилит:** camelCase (`mockData.ts`, `dashboardStore.ts`)
- **Экспорт:** именованный во всех файлах; default только в `App.tsx` и `main.tsx`
- **Типы:** все в `src/types/index.ts`; компоненты не объявляют собственных интерфейсов данных
- **Mock-данные:** только в `src/data/mockData.ts`

## Dark Mode

```css
/* index.css */
@custom-variant dark (&:where(.dark, .dark *));
```

Класс `dark` ставится на `<html>` через Zustand `toggleTheme()`. Tailwind `dark:` утилиты работают автоматически.

## See Also

- [State Management](state-management.md) — Zustand store в деталях
- [Компоненты](components.md) — каталог всех компонентов
