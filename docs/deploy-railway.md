# Деплой бэкенда на Railway + подключение прод-фронта (Vercel)

Пошаговая инструкция для ручного деплоя `apps/api` (NestJS + Prisma + Postgres) на
[Railway](https://railway.app) и подключения прод-фронта на Vercel.

Кодовая часть уже готова:
- `apps/api/Dockerfile` — multi-stage сборка (контекст = **корень монорепо**).
- `railway.json` (в корне репо) — builder=Dockerfile, healthcheck на `/api/health`,
  авто-миграции (`prisma migrate deploy`) перед выкаткой.
- `apps/api/src/main.ts` уже читает `PORT` и `CORS_ORIGIN` из env — хардкода нет.

> Закрывает пункты роадмапа **1.6** (деплой бэка) и **3.2** (Vercel с реальным API),
> issue [#21](https://github.com/VaskaBzh/Pulse/issues/21).

---

## Предпосылки

- Аккаунт на Railway (free tier достаточно) и на Vercel.
- Прод-фронт уже задеплоен на Vercel (нужен его домен для `CORS_ORIGIN`).

---

## Шаг 1 — Проект и Postgres на Railway (задача #1)

1. Railway → **New Project** → **Deploy from GitHub repo** → выбрать `VaskaBzh/Pulse`.
2. В проект добавить плагин: **New** → **Database** → **PostgreSQL**.
3. Railway автоматически прокинет `DATABASE_URL` через референс-переменную
   (`${{ Postgres.DATABASE_URL }}`) — забирать вручную строку не обязательно.

## Шаг 2 — Сервис API из Dockerfile (задача #2)

1. В настройках сервиса (не БД): **Settings → Source**.
2. **Root Directory** = `/` (корень репо — Dockerfile копирует `packages/contracts`
   и корневой `package-lock.json`, поэтому контекст сборки обязан быть корнем).
3. Builder определится из `railway.json` автоматически (`DOCKERFILE`,
   `dockerfilePath: apps/api/Dockerfile`). Если нет — выставить вручную.

## Шаг 3 — Переменные окружения (задача #3)

В сервисе API → **Variables**:

| Переменная | Значение |
|------------|----------|
| `DATABASE_URL` | `${{ Postgres.DATABASE_URL }}` (референс на плагин Postgres) |
| `CORS_ORIGIN` | прод-домен Vercel, например `https://pulse.vercel.app` — **с `https://`, без хвостового `/`** |
| `PORT` | **не задавать** — Railway инжектит свой; `main.ts` читает `process.env.PORT` |

`PRISMA_QUERY_ENGINE_LIBRARY` уже выставлен в `Dockerfile` — трогать не нужно.

## Шаг 4 — Миграции (задача #4)

Ничего делать не надо: `railway.json → deploy.preDeployCommand` прогоняет
`npx prisma migrate deploy` автоматически перед каждой выкаткой.

Проверить в логах деплоя строку об применённых миграциях. Если предпочитаешь
разово вручную — Railway service → **⋮ → Shell**: `npx prisma migrate deploy`.

## Шаг 5 — Сид данных (задача #5)

Сид — разовая операция (не в `preDeployCommand`, т.к. он делает `deleteMany` +
переинсерт на каждый деплой). Через Railway shell сервиса:

```bash
npx prisma db seed
```

`ts-node` и `prisma` есть в образе (dev-зависимости ставятся на этапе сборки).
Проверить, что таблицы заполнены: `npx prisma studio` локально против Railway
`DATABASE_URL`, либо smoke ниже.

## Шаг 6 — Smoke бэка (задача #6)

Публичный домен Railway (Settings → Networking → **Generate Domain**):

```bash
curl https://<railway-домен>/api/health          # → 200 {"status":"ok",...}
open  https://<railway-домен>/api/docs            # Swagger UI открывается
curl "https://<railway-домен>/api/metrics?range=90d"   # массив данных
curl  https://<railway-домен>/api/orders          # пагинированный ответ
```

## Шаг 7 — Подключить фронт на Vercel (задача #7, роадмап 3.2)

1. Vercel → проект фронта → **Settings → Environment Variables**.
2. Добавить `VITE_API_URL` = `https://<railway-домен>/api` для **Production** и **Preview**.
3. **Redeploy** прод-деплоймент (env применяется на сборке).

## Шаг 8 — Проверить прод end-to-end (задача #8)

1. Открыть прод-URL Vercel, убедиться что данные грузятся (дашборд, заказы, метрики).
2. DevTools → Console: **нет CORS-ошибок**. Если есть — сверить `CORS_ORIGIN`
   (Шаг 3) с точным доменом Vercel (`https://`, без `/` в конце).

## Шаг 9-10 — Финализация (задачи #9, #10)

- README: проставить hosting-лейблы (Frontend → Vercel, API+DB → Railway) в
  архитектурной диаграмме; убрать оговорки «финализируется после деплоя».
- Обновить описание GitHub-репозитория:
  `Fullstack analytics dashboard • React 19 + NestJS + Postgres + Prisma • E2E type-safe API contracts`
- Отметить в `ROADMAP.md` пункты **1.6** и **3.2** как ✅ (после зелёного smoke).
- Закрыть issue [#21](https://github.com/VaskaBzh/Pulse/issues/21).

---

## Риски / заметки

- **Free tier** Railway может засыпать/лимитироваться — для витрины ок.
- **CORS**: `CORS_ORIGIN` должен точно совпадать с доменом Vercel.
- **Build context**: только `apps/api` (web на Railway не деплоится); Dockerfile
  обязан видеть `packages/contracts` → root сервиса = корень репо.
