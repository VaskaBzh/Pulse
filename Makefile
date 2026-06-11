# Makefile — Pulse Dashboard
# Usage: make [target]   |   make help

SHELL := bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules

# ── Project ──────────────────────────────────────────────────────────────────
PROJECT  ?= $(shell node -p "require('./package.json').name" 2>/dev/null || basename $(CURDIR))
NODE_ENV ?= development

# ── Git ──────────────────────────────────────────────────────────────────────
VERSION    ?= $(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
COMMIT     ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_TIME := $(shell date -u '+%Y-%m-%dT%H:%M:%SZ')

# ── Package Manager ───────────────────────────────────────────────────────────
# Автодетекция. Переопределение: make PM=pnpm [target]
PM ?= $(shell \
	if [ -f bun.lockb ]; then echo "bun"; \
	elif [ -f pnpm-lock.yaml ]; then echo "pnpm"; \
	elif [ -f yarn.lock ]; then echo "yarn"; \
	else echo "npm"; fi)

PMX := $(shell \
	if [ "$(PM)" = "bun" ]; then echo "bunx"; \
	elif [ "$(PM)" = "pnpm" ]; then echo "pnpm exec"; \
	elif [ "$(PM)" = "yarn" ]; then echo "yarn"; \
	else echo "npx"; fi)

# =============================================================================
.DEFAULT_GOAL := help

##@ Разработка

.PHONY: install
install: ## Установить зависимости
	$(PM) install

.PHONY: dev
dev: ## Запустить dev-сервер (http://localhost:5173)
	$(PM) run dev

.PHONY: build
build: ## Production-сборка (tsc + vite build → dist/)
	NODE_ENV=production $(PM) run build

.PHONY: preview
preview: ## Просмотр production-сборки
	$(PM) run preview

##@ Тестирование

.PHONY: test
test: ## Запустить e2e-тесты (Playwright)
	$(PMX) playwright test

.PHONY: test-ui
test-ui: ## Открыть Playwright UI
	$(PMX) playwright test --ui

.PHONY: test-report
test-report: ## Показать последний отчёт Playwright
	$(PMX) playwright show-report

##@ Качество кода

.PHONY: lint
lint: ## Запустить ESLint
	$(PM) run lint

.PHONY: lint-fix
lint-fix: ## ESLint с автоисправлением
	$(PM) run lint -- --fix

.PHONY: typecheck
typecheck: ## Проверка типов TypeScript (без сборки)
	$(PMX) tsc --noEmit

.PHONY: check
check: lint typecheck ## Все статические проверки (lint + typecheck)

##@ CI

.PHONY: ci
ci: install check build ## Полный CI-пайплайн (install → check → build)

##@ Очистка

.PHONY: clean
clean: ## Удалить артефакты сборки
	rm -rf dist/ coverage/ playwright-report/ test-results/ node_modules/.cache

.PHONY: clean-all
clean-all: clean ## Удалить всё включая node_modules
	rm -rf node_modules/

##@ Справка

.PHONY: help
help: ## Показать список команд
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make \033[36m<target>\033[0m\n"} \
		/^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2} \
		/^##@/ {printf "\n\033[1m%s\033[0m\n", substr($$0, 5)}' $(MAKEFILE_LIST)
