[Back to README](../README.md) · [Architecture →](architecture.md)

# Getting Started

## Prerequisites

- Node.js 20+
- npm 10+
- Docker (for PostgreSQL — the backend needs a real database)

## Installation

```bash
git clone https://github.com/VaskaBzh/Pulse.git
cd Pulse
npm install               # installs apps/web, apps/api, packages/contracts (npm workspaces)
```

Copy the env file examples and adjust if needed:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

## Running the app

```bash
docker compose up postgres          # PostgreSQL on :5432
npm run prisma:migrate -w apps/api  # apply schema (first run only)
npm run prisma:seed -w apps/api     # seed demo data (first run only)
npm run dev:api                     # backend → http://localhost:3000/api (Swagger: /api/docs)
npm run dev                         # frontend → http://localhost:5173
```

### Production build

```bash
npm run build       # frontend: tsc -b && vite build → apps/web/dist/
npm run build:api   # backend build
npm run preview     # serve frontend dist/ locally → http://localhost:4173
```

---

## All commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend dev server with HMR |
| `npm run dev:api` | Backend dev server (watch mode) |
| `npm run dev:all` | Both dev servers together |
| `npm run build` | Frontend production build |
| `npm run build:api` | Backend production build |
| `npm run preview` | Serve frontend production build locally |
| `npm run lint` | ESLint on `apps/web` (CI enforces max 35 warnings) |
| `npm run typecheck` | Typecheck both `apps/web` and `apps/api` |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (used in CI) |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Frontend: Vitest watch mode |
| `npm run test:run` (`-w apps/web`) | Frontend: Vitest single run |
| `npm run test:ui` (`-w apps/web`) | Frontend: Vitest interactive UI |
| `npm run coverage` (`-w apps/web`) | Frontend coverage — thresholds: 70% lines/functions/statements, 60% branches |
| `npm run test:api` | Backend: Jest + Supertest e2e tests |
| `npm run e2e` | Playwright e2e against the frontend dev server |
| `npm run e2e:ui` | Playwright interactive UI mode |
| `npm run e2e:report` | Open last HTML report |

---

## CI Pipeline

GitHub Actions runs on every push to `feature/**` and every PR to `develop` / `main`:

```
Lint → Typecheck → Unit Tests → E2E Tests
```

Deploy preview is posted as a PR comment on every PR via Vercel.

---

## See Also

- [Architecture](architecture.md) — monorepo layout and dependency rules
- [API Reference](api.md) — backend endpoints and env vars in detail
- [State Management](state-management.md) — Zustand store and React Query
