# AGENTS.md

> Этот файл — структурная карта проекта для AI-агентов и новых разработчиков. Обновляйте при существенных изменениях структуры.

## Обзор проекта

Pulse Dashboard — аналитический SaaS-дашборд для мониторинга бизнес-метрик (выручка, заказы, пользователи, конверсия) с поддержкой тёмной/светлой темы и фильтрацией по временным периодам.

## Технический стек

- **Язык:** TypeScript ~6.0
- **Фреймворк:** React 19 (с React Compiler)
- **Стилизация:** Tailwind CSS v4
- **Графики:** Recharts v3
- **State management:** Zustand v5
- **Сборщик:** Vite v8

## Структура проекта

```
react-test-2/
├── src/
│   ├── App.tsx                  # Корневой компонент, layout: Sidebar + TopBar + Dashboard
│   ├── main.tsx                 # Точка входа React
│   ├── index.css                # Глобальные стили, Tailwind import
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx      # Боковая навигация (коллапсируемая)
│   │   │   └── TopBar.tsx       # Верхняя панель с переключателями темы и периода
│   │   ├── ui/
│   │   │   └── KPICard.tsx      # Карточка метрики со спарклайном
│   │   ├── charts/
│   │   │   ├── RevenueAreaChart.tsx  # Recharts AreaChart выручки
│   │   │   ├── OrdersBarChart.tsx    # Recharts BarChart заказов
│   │   │   └── TrafficDonutChart.tsx # Recharts PieChart трафика
│   │   └── tables/
│   │       ├── RecentOrdersTable.tsx # Таблица последних заказов
│   │       └── TopProductsTable.tsx  # Таблица топ-продуктов
│   ├── pages/
│   │   └── Dashboard.tsx        # Главная страница — компонует KPI + графики + таблицы
│   ├── store/
│   │   └── dashboardStore.ts    # Zustand store: theme, dateRange, filteredMetrics, summaryStats
│   ├── hooks/
│   │   └── useExport.ts         # Хук для экспорта данных
│   ├── data/
│   │   └── mockData.ts          # Mock-данные: 90 дней метрик + заказы + продукты + трафик
│   ├── types/
│   │   └── index.ts             # Централизованные TypeScript типы
│   └── assets/                  # Статические ресурсы (hero.png, svg)
├── .ai-factory/                 # AI Factory контекст проекта
│   ├── DESCRIPTION.md           # Спецификация проекта
│   ├── ARCHITECTURE.md          # Архитектурные решения
│   ├── config.yaml              # Конфигурация AI Factory
│   └── rules/
│       └── base.md              # Базовые конвенции кодовой базы
├── .claude/
│   └── skills/                  # Проектные AI-скиллы
├── .mcp.json                    # MCP серверы (github, chromeDevtools, playwright)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Ключевые точки входа

| Файл | Назначение |
|------|-----------|
| `src/main.tsx` | Точка входа приложения |
| `src/App.tsx` | Корневой layout |
| `src/pages/Dashboard.tsx` | Главная страница дашборда |
| `src/store/dashboardStore.ts` | Единый Zustand store |
| `src/types/index.ts` | Все TypeScript типы |
| `src/data/mockData.ts` | Источник данных (mock) |
| `vite.config.ts` | Конфигурация Vite |

## Документация

| Документ | Путь | Описание |
|----------|------|---------|
| README | `README.md` | Landing page проекта |
| Начало работы | `docs/getting-started.md` | Установка, запуск, тестирование |
| Архитектура | `docs/architecture.md` | Структура проекта, правила зависимостей |
| Компоненты | `docs/components.md` | KPICard, графики, таблицы |
| State Management | `docs/state-management.md` | Zustand store, селекторы, типы |
| Git Workflow | `docs/git-workflow.md` | Git flow, conventional commits, GitHub MCP |
| Спецификация | `.ai-factory/DESCRIPTION.md` | Детальная спецификация проекта |
| Базовые правила | `.ai-factory/rules/base.md` | Соглашения об именовании и паттернах |

## AI Context Files

| Файл | Назначение |
|------|-----------|
| `AGENTS.md` | Структурная карта проекта для AI-агентов |
| `.ai-factory/DESCRIPTION.md` | Детальная спецификация проекта |
| `.ai-factory/ARCHITECTURE.md` | Архитектурные решения: Structured Modules по feature |
| `.ai-factory/config.yaml` | Конфигурация AI Factory (язык, git, пути) |

## Быстрые команды (Makefile)

| Команда | Описание |
|---------|---------|
| `make dev` | Dev-сервер → http://localhost:5173 |
| `make build` | Production-сборка → dist/ |
| `make lint` | ESLint |
| `make typecheck` | TypeScript проверка типов |
| `make check` | lint + typecheck |
| `make test` | Playwright e2e-тесты |
| `make ci` | install + check + build |
| `make clean` | Удалить dist/, playwright-report/ |

## Правила для агентов

- Shell-команды разбивай на отдельные шаги — не объединяй несвязанные операции через `&&`
  - Неправильно: `npm run build && npm run lint`
  - Правильно: сначала `npm run build`, затем `npm run lint`
- Zustand store — единый источник истины для всех вычисляемых данных
- Компоненты читают только из `src/types/index.ts` для типов
- Mock-данные только в `src/data/mockData.ts` — не создавай данные в компонентах

## Git Workflow

- Вся разработка ведётся на `feature/*` или `fix/*` ветках, ответвлённых от `develop`
- Прямые коммиты в `main` и `develop` запрещены — только через PR
- Все коммиты должны следовать [Conventional Commits](docs/git-workflow.md): `feat(scope): description`
- Default branch для PR — `develop`, не `main`
- После merge feature-ветки — удалять её локально: `git branch -d feature/<name>`
