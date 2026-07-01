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

.PHONY: db-studio
db-studio: ## Открыть Prisma Studio
	npm run prisma:studio -w apps/api

.PHONY: db-reset
db-reset: ## Сбросить БД и заново мигрировать + seed
	cd apps/api && npx prisma migrate reset --force

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

##@ Качество кода

.PHONY: lint
lint: ## Запустить ESLint (frontend)
	npm run lint -w apps/web

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
