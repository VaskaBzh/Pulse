[← State Management](state-management.md) · [Back to README](../README.md)

# Git Workflow

Соглашения по работе с git в проекте Pulse Dashboard.

---

## Git Flow

Проект использует упрощённую модель Git Flow:

```
main         ← production-ready (защищённая ветка)
develop      ← интеграционная ветка, default target для PR
feature/*    ← новые фичи (ответвляются от develop)
fix/*        ← баг-фиксы
release/*    ← подготовка релиза (develop → main)
```

### Жизненный цикл фичи

```bash
# 1. Начать новую фичу от develop
git checkout develop
git pull origin develop
git checkout -b feature/orders-table

# 2. Работать, коммитить (conventional commits)
git add src/features/orders/
git commit -m "feat(orders): add sortable orders table with pagination"

# 3. Пушить и открывать PR в develop
git push -u origin feature/orders-table
# → GitHub: открыть PR feature/orders-table → develop

# 4. После merge — удалить ветку локально
git branch -d feature/orders-table
```

### Именование веток

| Префикс | Назначение | Пример |
|---------|-----------|--------|
| `feature/` | Новая функциональность | `feature/analytics-heatmap` |
| `fix/` | Исправление бага | `fix/kpi-card-overflow` |
| `refactor/` | Рефакторинг | `refactor/zustand-selectors` |
| `chore/` | Инфраструктура, зависимости | `chore/upgrade-recharts-v3` |
| `docs/` | Документация | `docs/architecture-update` |
| `release/` | Подготовка релиза | `release/1.0.0` |

---

## Conventional Commits

Все коммиты должны следовать формату [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Типы коммитов

| Тип | Когда использовать |
|-----|-------------------|
| `feat` | Новая функциональность |
| `fix` | Исправление бага |
| `refactor` | Рефакторинг без изменения поведения |
| `test` | Добавление или изменение тестов |
| `docs` | Документация |
| `chore` | Зависимости, конфигурация, инфраструктура |
| `ci` | CI/CD изменения |
| `style` | Форматирование кода (без изменения логики) |
| `perf` | Улучшение производительности |

### Скоупы (scope)

Скоуп — название фичи или области кода:

```
feat(dashboard): ...
feat(orders): ...
fix(charts): ...
refactor(store): ...
docs(git): ...
chore(deps): ...
```

### Примеры

```bash
# Новая функциональность
git commit -m "feat(analytics): add revenue trend with period comparison"
git commit -m "feat(orders): add sortable table with status filter"

# Баг-фикс
git commit -m "fix(store): correct percentage calculation for previous period"
git commit -m "fix(sidebar): prevent icon overflow when collapsed"

# Рефакторинг
git commit -m "refactor(charts): extract CustomTooltip to shared component"

# Зависимости / инфраструктура
git commit -m "chore(deps): upgrade recharts to v3.8"
git commit -m "chore(git): setup commitlint and husky hooks"

# Документация
git commit -m "docs(architecture): update structured modules diagram"
```

### Правила

- Описание в нижнем регистре, без точки в конце
- Императивный стиль: "add", не "added" / "adds"
- Не более 72 символов в первой строке
- Пустая строка между заголовком и телом коммита

### Валидация

Husky автоматически проверяет формат коммитов через `commit-msg` хук. Неправильный коммит будет отклонён:

```bash
$ git commit -m "updated stuff"
✖  subject may not be empty [subject-empty]
✖  type may not be empty [type-empty]
```

---

## GitHub MCP

В проекте настроен MCP-сервер `github` (`.mcp.json`), который позволяет AI-агентам работать с репозиторием `VaskaBzh/Pulse` напрямую.

### Доступные операции

| MCP-инструмент | Что делает |
|---------------|-----------|
| `mcp__github__create_branch` | Создать ветку |
| `mcp__github__create_pull_request` | Открыть PR |
| `mcp__github__get_pull_request` | Получить информацию о PR |
| `mcp__github__list_pull_requests` | Список открытых PR |
| `mcp__github__create_issue` | Создать issue |
| `mcp__github__list_issues` | Список issues |
| `mcp__github__get_file_contents` | Прочитать файл из репозитория |
| `mcp__github__push_files` | Запушить файлы |
| `mcp__github__search_code` | Поиск по коду |

### Настройка токена

MCP github сервер использует переменную окружения `GITHUB_TOKEN`. Токен должен иметь scope `repo`.

```json
// .mcp.json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

Установить токен в окружении (добавить в `.env.local` или shell profile):

```bash
export GITHUB_TOKEN=ghp_your_token_here
```

### Пример использования

Когда AI-агент (Claude Code) выполняет задачи, он может использовать MCP для:

1. Создания PR после завершения feature-ветки
2. Проверки статуса CI
3. Просмотра комментариев к PR
4. Создания issues для отслеживания задач

---

## See Also

- [Архитектура](architecture.md) — структура проекта и правила зависимостей
- [Начало работы](getting-started.md) — установка и запуск
- [State Management](state-management.md) — Zustand store
