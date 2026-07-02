[← State Management](state-management.md) · [Back to README](../README.md)

# Git Workflow

---

## Git Flow

```
main         ← production-ready (protected)
develop      ← integration branch, default PR target
feature/*    ← new features (branch from develop)
fix/*        ← bug fixes
release/*    ← release preparation (develop → main)
```

### Feature lifecycle

```bash
# 1. Start from develop
git checkout develop && git pull
git checkout -b feature/orders-table

# 2. Commit with conventional commits
git add apps/web/src/features/orders/
git commit -m "feat(orders): add sortable table with status filter"

# 3. Push and open PR targeting develop
git push -u origin feature/orders-table

# 4. After merge — delete the branch
git branch -d feature/orders-table
```

### Branch naming

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feature/` | New functionality | `feature/analytics-heatmap` |
| `fix/` | Bug fix | `fix/kpi-card-overflow` |
| `refactor/` | Refactoring | `refactor/zustand-selectors` |
| `chore/` | Deps, infrastructure | `chore/upgrade-recharts` |
| `docs/` | Documentation | `docs/architecture-update` |
| `release/` | Release prep | `release/1.0.0` |

---

## Conventional Commits

Format: `<type>(<scope>): <description>`

### Types

| Type | When to use |
|------|------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Refactor without behavior change |
| `test` | Add or change tests |
| `docs` | Documentation |
| `chore` | Deps, config, infrastructure |
| `ci` | CI/CD changes |
| `style` | Formatting only |
| `perf` | Performance improvement |

### Scopes

Named after the feature or area:

```
feat(dashboard):   ...
feat(orders):      ...
fix(charts):       ...
refactor(store):   ...
ci(github):        ...
```

### Rules

- Lowercase description, no trailing period
- Imperative mood: "add" not "added" / "adds"
- First line max 72 characters
- Empty line between subject and body

### Validation

Husky validates commit format via the `commit-msg` hook. Non-conforming commits are rejected:

```bash
$ git commit -m "updated stuff"
✖  subject may not be empty [subject-empty]
✖  type may not be empty [type-empty]
```

---

## CI Triggers

| Event | Workflows triggered |
|-------|-------------------|
| Push to `feature/**`, `fix/**`, `release/**` | CI (lint → typecheck → unit → e2e) |
| PR to `develop` or `main` | CI + Deploy Preview (Vercel) |

---

## See Also

- [Architecture](architecture.md) — project structure
- [Getting Started](getting-started.md) — running the project locally