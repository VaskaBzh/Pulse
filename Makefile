# Makefile — Pulse Monorepo
# Usage: make [target]   |   make help

SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

# ── Project ──────────────────────────────────────────────────────────────────
NODE_ENV ?= development

# ── Git ──────────────────────────────────────────────────────────────────────
VERSION    ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT     ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_TIME := $(shell date -u '+%Y-%m-%dT%H:%M:%SZ')

# =============================================================================
.DEFAULT_GOAL := help

##@ Разработка

.PHONY: install
install: ## Установить зависимости (все workspaces)
	npm install

.PHONY: dev
dev: ## Запустить frontend dev-сервер (http://localhost:5173)
	npm run dev -w apps/web

.PHONY: dev-api
dev-api: ## Запустить API dev-сервер (http://localhost:3000)
	npm run start:dev -w apps/api

.PHONY: dev-all
dev-all: ## Запустить frontend + API параллельно
	npm run dev -w apps/web & npm run start:dev -w apps/api

# Порты dev-серверов, которые чистит stop-dev (nest + vite с запасом на фолбэк)
DEV_PORTS     := 3000 5173 5174 5175
DEV_PORTS_CSV := 3000,5173,5174,5175

.PHONY: stop-dev
stop-dev: ## Остановить нативные dev-процессы (vite+nest) на портах 3000/5173-5175
	@echo "Останавливаю dev-процессы на портах: $(DEV_PORTS)"
	# Linux/macOS-node — виден через lsof
	if command -v lsof >/dev/null 2>&1; then
	  pids=$$(lsof -t $(addprefix -i :,$(DEV_PORTS)) 2>/dev/null || true)
	  if [ -n "$$pids" ]; then kill $$pids 2>/dev/null || true; echo "  killed (lsof): $$pids"; fi
	fi
	# Windows-node из-под WSL — виден только через PowerShell
	if command -v powershell.exe >/dev/null 2>&1; then
	  powershell.exe -NoProfile -Command "Get-NetTCPConnection -State Listen -LocalPort $(DEV_PORTS_CSV) -ErrorAction SilentlyContinue | Select-Object -Expand OwningProcess -Unique | ForEach-Object { try { Stop-Process -Id \$$_ -Force -ErrorAction Stop; Write-Host ('  killed (win): ' + \$$_) } catch {} }" 2>/dev/null || true
	fi
	@echo "Готово."

.PHONY: stop-all
stop-all: stop-dev down ## Остановить всё: нативные dev-процессы + docker-контейнеры

.PHONY: build
build: ## Production-сборка frontend (tsc + vite build → dist/)
	NODE_ENV=production npm run build -w apps/web

.PHONY: build-api
build-api: ## Production-сборка API (nest build → dist/)
	npm run build -w apps/api

.PHONY: preview
preview: ## Просмотр production-сборки frontend
	npm run preview -w apps/web

##@ Docker

.PHONY: build-images
build-images: ## Собрать образы postgres + api + web (требует profile full)
	docker compose --profile full build

.PHONY: up
up: ## Запустить postgres (docker compose up -d)
	docker compose up -d postgres

.PHONY: up-all
up-all: ## Запустить postgres + api + frontend (docker compose --profile full up -d)
	docker compose --profile full up -d

.PHONY: down
down: ## Остановить контейнеры
	docker compose --profile full down

.PHONY: logs
logs: ## Логи контейнеров
	docker compose logs -f

##@ Prisma

.PHONY: db-migrate
db-migrate: ## Применить миграции Prisma
	npm run prisma:migrate -w apps/api

.PHONY: db-seed
db-seed: ## Заполнить БД seed-данными
	npm run prisma:seed -w apps/api

.PHONY: db-generate
db-generate: ## Сгенерировать Prisma Client
	npm run prisma:generate -w apps/api

.PHONY: db-studio
db-studio: ## Открыть Prisma Studio
	npm run prisma:studio -w apps/api

.PHONY: db-reset
db-reset: ## Сбросить БД и заново мигрировать + seed
	cd apps/api && npx prisma migrate reset --force

##@ OpenAPI / типизированный клиент

.PHONY: generate-openapi
generate-openapi: ## Сгенерировать apps/api/openapi.json (offline, preview-режим, без БД)
	npm run generate:openapi -w apps/api

.PHONY: generate-api
generate-api: ## Полный пайплайн: openapi.json → типизированный клиент web (generated.ts)
	npm run generate:api

.PHONY: check-api-drift
check-api-drift: ## Проверить, что openapi.json/generated.ts не разошлись с контрактом (CI-гейт)
	npm run check:api-drift

##@ Тестирование

.PHONY: test
test: ## Запустить unit-тесты frontend
	npm run test:run -w apps/web

.PHONY: test-api
test-api: ## Запустить e2e-тесты API
	npm run test:e2e -w apps/api

.PHONY: e2e
e2e: ## Запустить e2e-тесты Playwright
	npm run e2e -w apps/web

.PHONY: e2e-ui
e2e-ui: ## Открыть Playwright UI
	npm run e2e:ui -w apps/web

.PHONY: coverage
coverage: ## Покрытие тестами (frontend Vitest + API Jest)
	npm run coverage -w apps/web
	npm run test:cov -w apps/api

##@ Качество кода

.PHONY: lint
lint: ## Запустить ESLint (frontend)
	npm run lint -w apps/web

.PHONY: lint-api
lint-api: ## Запустить ESLint (API)
	npm run lint -w apps/api

.PHONY: lint-fix
lint-fix: ## Исправить ESLint-ошибки (frontend + API)
	npm run lint:fix -w apps/web
	npm run lint:fix -w apps/api

.PHONY: fmt
fmt: ## Форматировать код через Prettier
	npx prettier --write .

.PHONY: fmt-check
fmt-check: ## Проверить форматирование (Prettier, без записи)
	npx prettier --check .

.PHONY: typecheck
typecheck: ## Проверка типов TypeScript (все workspaces)
	npm run typecheck

.PHONY: check
check: lint typecheck ## Все статические проверки (lint + typecheck)

##@ CI

.PHONY: ci
ci: install check build ## Полный CI-пайплайн (install → check → build)

##@ Очистка

.PHONY: clean
clean: ## Удалить артефакты сборки
	rm -rf apps/web/dist apps/api/dist coverage/ playwright-report/ test-results/

.PHONY: clean-all
clean-all: clean ## Удалить всё включая node_modules
	rm -rf node_modules/ apps/web/node_modules/ apps/api/node_modules/ packages/contracts/node_modules/

##@ Справка

.PHONY: help
help: ## Показать список команд
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} \
		/^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)}' $(MAKEFILE_LIST)
