[Back to README](../README.md) · [Architecture →](architecture.md)

# Getting Started

## Prerequisites

- Node.js 20+
- npm 10+

## Installation

```bash
git clone https://github.com/VaskaBzh/Pulse.git
cd Pulse
npm install
```

## Running the app

```bash
npm run dev        # dev server → http://localhost:5173
```

### Production build

```bash
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve dist/ locally → http://localhost:4173
```

---

## All commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | ESLint (max 20 warnings) |
| `npm run format` | Prettier write |
| `npm run format:check` | Prettier check (used in CI) |

### Testing

| Command | Description |
|---------|-------------|
| `npm test` | Vitest watch mode |
| `npm run test:run` | Vitest single run |
| `npm run test:ui` | Vitest interactive UI |
| `npm run coverage` | Coverage report — thresholds: 70% lines/functions/statements, 60% branches |
| `npm run e2e` | Playwright e2e against dev server |
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

- [Architecture](architecture.md) — project structure and dependency rules
- [State Management](state-management.md) — Zustand store and React Query
