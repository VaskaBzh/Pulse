# Pulse — Analytics Dashboard

[![CI](https://github.com/VaskaBzh/Pulse/actions/workflows/ci.yml/badge.svg)](https://github.com/VaskaBzh/Pulse/actions/workflows/ci.yml)

> Fullstack analytics dashboard built as a portfolio project — React 19 frontend backed by a real NestJS + PostgreSQL API, with a shared Zod contract between them.

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
| Frontend | React 19 + TypeScript (strict mode), Vite 8 |
| Styles | Tailwind CSS v4 |
| Charts | Recharts 3 |
| State | Zustand 5 |
| Data fetching | TanStack Query v5 |
| Forms | React Hook Form v7 + Zod v4 |
| Routing | React Router v6 |
| Backend | NestJS v11 + Prisma v6 + PostgreSQL 16 |
| Shared contracts | Zod schemas (`packages/contracts`) — single source of truth for request/response shapes on both sides |
| API docs | Swagger, auto-generated (`/api/docs`) |
| Testing | Vitest 4 + React Testing Library + Playwright (frontend), Jest + Supertest (backend) |
| Icons | lucide-react |
| Utilities | clsx, date-fns |

---

## Architecture

```
Frontend (apps/web, Vite dev server :5173)
        │  fetch, validated against packages/contracts
        ▼
Backend (apps/api, NestJS :3000/api)
        │  Prisma ORM
        ▼
PostgreSQL (Docker Compose, :5432)
```

`packages/contracts` holds the Zod schemas both apps import — the frontend validates every response against the same schema the backend uses to validate requests, so the contract can't silently drift.

## Project Structure

```
apps/web/src/
├── features/                   — one directory per page
│   ├── analytics/
│   ├── customers/
│   ├── dashboard/
│   ├── orders/
│   ├── products/
│   ├── reports/
│   └── settings/
├── shared/                     — cross-feature code only
│   ├── api/                    — API layer (httpClient.ts + per-resource fetchers, validated via @pulse/contracts)
│   ├── components/
│   │   ├── layout/             — Sidebar, TopBar
│   │   └── ui/                 — KPICard, Modal, Popover
│   ├── hooks/                  — useExport
│   ├── lib/                    — Zod validation schemas
│   ├── store/                  — dashboardStore (Zustand)
│   └── types/                  — shared TypeScript interfaces (re-exported from @pulse/contracts where applicable)
├── App.tsx
└── main.tsx

apps/api/src/                   — one module per domain (controller + service)
├── metrics/ orders/ products/ customers/ traffic/ analytics/ health/
├── prisma/                     — PrismaService (global module)
└── main.tsx                    — bootstrap, Swagger, CORS

packages/contracts/src/         — shared Zod schemas (metrics, orders, products, customers, traffic, funnel, retention, pagination)
```

**Rule:** features can import from `shared/`, but never from each other.

---

## Getting Started

```bash
npm install                        # installs all workspaces (apps/web, apps/api, packages/contracts)
docker compose up postgres         # starts PostgreSQL on :5432
npm run dev:api                    # backend on http://localhost:3000/api (Swagger at /api/docs)
npm run dev                        # frontend on http://localhost:5173
```

Backend env vars live in `apps/api/.env` (see `apps/api/.env.example`); frontend reads `VITE_API_URL` from `apps/web/.env` (see `apps/web/.env.example`).

### All commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend dev server with HMR |
| `npm run dev:api` | Backend dev server (watch mode) |
| `npm run dev:all` | Both dev servers together |
| `npm run build` | Frontend production build (`tsc -b && vite build`) |
| `npm run build:api` | Backend production build |
| `npm run lint` | ESLint (frontend) |
| `npm run typecheck` | Typecheck both apps |
| `npm test` | Frontend unit tests (Vitest) |
| `npm run test:api` | Backend e2e tests (Jest + Supertest) |
| `npm run coverage` | Frontend coverage report (threshold: 70%) |
| `npm run e2e` | Playwright e2e tests (Chromium) |
| `npm run e2e:ui` | Playwright interactive UI mode |
| `npm run e2e:report` | Open last HTML report |

---

## Testing

**117 unit tests** (frontend) across store, API layer, validation schemas, hooks, and UI components:

```bash
npm run coverage
```

**11 e2e tests** covering dashboard golden path and orders critical scenarios:

```bash
npm run e2e
```

Backend e2e tests (Jest + Supertest) cover every endpoint:

```bash
npm run test:api
```

CI runs lint → typecheck → unit tests → e2e on every push and pull request.

---

## Docs

| Section | Description |
|---------|-------------|
| [Getting Started](docs/getting-started.md) | Prerequisites, all commands, testing guide |
| [Architecture](docs/architecture.md) | Monorepo layout, feature-based structure, dependency rules |
| [API Reference](docs/api.md) | Backend endpoints, request/response shapes, shared contracts |
| [Components](docs/components.md) | KPICard, charts, tables, layout, Modal, Popover |
| [State Management](docs/state-management.md) | Zustand store, React Query, forms |
| [Git Workflow](docs/git-workflow.md) | Git flow, conventional commits, CI triggers |
