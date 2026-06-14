# ADR: Vite SPA vs Next.js App Router

**Date:** 2026-06-13  
**Status:** Accepted  
**Decision: Stay on Vite SPA**

---

## Context

The Pulse Dashboard is currently built as a Vite SPA with React 19, React Router v6, Tailwind v4, and Zustand. As part of the React Ecosystem Upgrade milestone, we evaluate whether migrating to Next.js App Router would benefit this project.

---

## Options Evaluated

### Option A — Stay on Vite SPA

Continue with Vite + React Router v6, add TanStack Query, React Hook Form + Zod, and UI patterns on top of the existing stack.

### Option B — Migrate to Next.js App Router

Replace Vite + React Router with Next.js 15 App Router, adopting file-based routing, React Server Components, and the Next.js ecosystem.

---

## Analysis

### 1. SEO Requirements

**Question:** Does this dashboard need SSR or SSG?

A SaaS analytics dashboard sits behind authentication. All pages (`/orders`, `/analytics`, `/customers`, etc.) are protected routes that require login. Search engines do not index authenticated dashboards — there is no SEO value in rendering them on the server.

**Verdict: No SSR/SSG need. Vite SPA is sufficient.**

### 2. React Server Components (RSC)

**Question:** Do RSC provide meaningful benefits for analytics with mock data?

RSC shine when:
- Data is fetched on the server (database queries, API calls that benefit from co-location)
- Reducing client bundle size matters (heavy server-only libraries)
- Streaming progressive rendering improves perceived performance

In Pulse Dashboard:
- All data comes from in-memory mock data (no network round-trips)
- TanStack Query with `staleTime` handles client-side caching efficiently
- The dashboard is a Zustand-driven SPA where state changes (dateRange, theme, filters) must be reactive — they are inherently client-side

Adopting RSC here would require marking most components `'use client'`, negating the benefit while adding complexity.

**Verdict: RSC provide no meaningful value. TanStack Query on the client is the right tool.**

### 3. Migration Complexity

Moving to Next.js App Router would require:

| Change | Effort |
|--------|--------|
| Replace React Router v6 routes with `app/(dashboard)/*/page.tsx` | Medium |
| Convert `BrowserRouter` + `AppLayout` → `app/layout.tsx` | Medium |
| Wrap TanStack Query `QueryClientProvider` in `'use client'` boundary | Low |
| Adapt Zustand store (already client-compatible) | Low |
| Migrate Tailwind v4 + `@tailwindcss/vite` → `@tailwindcss/next` (experimental) | **High** |
| Re-learn file-based routing conventions for a team already using RRv6 | Medium |
| Update all `NavLink`/`useLocation` → `Link`/`usePathname` | Medium |

**Tailwind v4 is the critical blocker.** The `@tailwindcss/vite` plugin is first-party and stable. The Next.js Tailwind v4 plugin (`@tailwindcss/next`) is experimental and not recommended for production at time of writing.

**Verdict: Migration cost is high with no proportional gain.**

### 4. Developer Experience

| Dimension | Vite SPA | Next.js App Router |
|-----------|----------|--------------------|
| Dev server startup | ~200ms (Vite HMR) | ~1–3s |
| HMR speed | Instant (native ESM) | Fast, but RSC adds overhead |
| Debugging | Single render environment | Client + Server dual context |
| Deploy target | Any static host (Vercel, Netlify, GitHub Pages) | Vercel optimal; Node.js required for SSR |
| Complexity ceiling | Low for SPA | High (caching, directives, boundaries) |

For a portfolio project focused on demonstrating React architecture skills, the simplicity of Vite SPA allows the architecture patterns (feature modules, Zustand, TanStack Query) to be visible without Next.js abstractions layering over them.

**Verdict: Vite DX is superior for this project's needs.**

### 5. Tailwind v4 Compatibility

Pulse Dashboard uses `@tailwindcss/vite` (v4 Vite plugin). This is the canonical, fully supported integration.

Next.js + Tailwind v4 requires PostCSS-based integration or the experimental `@tailwindcss/next` plugin. Neither is production-stable at the level of `@tailwindcss/vite`.

**Verdict: Tailwind v4 is a hard blocker for Next.js migration today.**

---

## Decision: Stay on Vite SPA

**Rationale:**

1. No authenticated SaaS dashboard needs server-side rendering for SEO
2. TanStack Query provides all the data-fetching capabilities needed client-side
3. Tailwind v4 + Vite is the stable, supported integration path
4. Migration cost is disproportionate to any gain
5. The architecture (feature modules, Zustand, React Query) is more clearly visible in a clean SPA without Next.js meta-framework abstractions

**Consequence:** Task 11 (Next.js migration) in the React Ecosystem Upgrade plan is **skipped**.

---

## Revisit Criteria

Reconsider Next.js migration if any of the following become true:

- The dashboard gains a public-facing landing page or marketing pages that need SEO
- The app adds a real backend API and RSC data-fetching becomes beneficial
- Tailwind v4 Next.js plugin reaches stable status
- The project moves to a monorepo with multiple packages where Next.js DX improvements justify the cost
