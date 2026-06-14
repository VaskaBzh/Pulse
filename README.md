# Pulse — Analytics Dashboard

[![CI](https://github.com/VaskaBzh/Pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/VaskaBzh/Pulse/actions/workflows/ci.yml)

> SaaS-style analytics dashboard built as a portfolio project demonstrating production-grade React architecture.

**[Live Demo](https://pulse-jlm996fak-vasily-s-projects3.vercel.app)**

---

## Features

**7 pages** connected via React Router v6:

| Page | What it shows |
|------|---------------|
| Dashboard | KPI cards, revenue/traffic/orders charts, recent orders & top products |
| Analytics | Funnel, retention heatmap, channel breakdown |
| Orders | Filterable/searchable table with status filter, sort, and order detail modal |
| Customers | Segment cards and LTV metrics |
| Products | Product catalog with revenue metrics |
| Reports | Export form (CSV / JSON) with React Hook Form + Zod validation |
| Settings | Profile and notification settings |

**Cross-page features:**
- Date range filter: **7D / 30D / 90D** — recalculates all KPIs with period-over-period comparison
- Dark / light theme toggle (Tailwind v4 class strategy, default dark)
- Collapsible sidebar (240px → 68px icon mode)
- CSV export via `useExport` hook

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript (strict mode) |
| Build | Vite 8 |
| Styles | Tailwind CSS v4 |
| Charts | Recharts 3 |
| State | Zustand 5 |
| Data fetching | TanStack Query v5 |
| Forms | React Hook Form v7 + Zod v4 |
| Routing | React Router v6 |
| Testing | Vitest 4 + React Testing Library + Playwright |
| Icons | lucide-react |
| Utilities | clsx, date-fns |

---

## Project Structure

```
src/
├── features/                   — one directory per page
│   ├── analytics/
│   ├── customers/
│   ├── dashboard/
│   ├── orders/
│   ├── products/
│   ├── reports/
│   └── settings/
├── shared/                     — cross-feature code only
│   ├── api/                    — React Query fetchers (mock API layer)
│   ├── components/
│   │   ├── layout/             — Sidebar, TopBar
│   │   └── ui/                 — KPICard, Modal, Popover
│   ├── hooks/                  — useExport
│   ├── lib/                    — Zod validation schemas
│   ├── store/                  — dashboardStore (Zustand)
│   └── types/                  — shared TypeScript interfaces
├── App.tsx
└── main.tsx
```

**Rule:** features can import from `shared/`, but never from each other.

---

## Getting Started

```bash
npm install
npm run dev        # http://localhost:5173
```

### All commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build (`tsc -b && vite build`) |
| `npm run preview` | Serve production build locally |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Vitest watch mode |
| `npm run coverage` | Coverage report (threshold: 70%) |
| `npm run e2e` | Playwright e2e tests (Chromium) |
| `npm run e2e:ui` | Playwright interactive UI mode |
| `npm run e2e:report` | Open last HTML report |

---

## Testing

**97 unit tests** across store, validation schemas, hooks, and UI components:

```bash
npm run coverage
```

**11 e2e tests** covering dashboard golden path and orders critical scenarios:

```bash
npm run e2e
```

CI runs lint → typecheck → unit tests → e2e on every push and pull request.

---

## Docs

| Section | Description |
|---------|-------------|
| [Getting Started](docs/getting-started.md) | Prerequisites, all commands, testing guide |
| [Architecture](docs/architecture.md) | Feature-based structure, dependency rules |
| [Components](docs/components.md) | KPICard, charts, tables, layout, Modal, Popover |
| [State Management](docs/state-management.md) | Zustand store, React Query, forms |
| [Git Workflow](docs/git-workflow.md) | Git flow, conventional commits, CI triggers |
