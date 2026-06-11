[Back to README](../README.md) · [Архитектура →](architecture.md)

# Начало работы

## Предварительные требования

- Node.js 20+
- npm 10+

## Установка и запуск

```bash
# Клонируй репозиторий и установи зависимости
npm install

# Запусти dev-сервер
npm run dev
# → http://localhost:5173
```

## Все команды

| Команда | Описание |
|---------|---------|
| `npm run dev` | Dev-сервер с HMR |
| `npm run build` | Production-сборка (`tsc -b && vite build`) |
| `npm run preview` | Превью production-сборки |
| `npm run lint` | ESLint + typescript-eslint |

## Как протестировать функционал

| Действие | Что проверить |
|----------|-------------|
| Кликнуть **7D** | KPI-значения уменьшатся, графики покажут 7 дней |
| Кликнуть **90D** | Графики расширятся до 3 месяцев |
| Нажать ☀ в TopBar | Тема переключится на светлую |
| Нажать **Export CSV** | Скачается `.csv` файл за выбранный период |
| Нажать `‹` на сайдбаре | Сайдбар сожмётся до иконок (240px → 68px) |
| Навести на линию графика | Кастомный tooltip с датой и значениями |
| Навести на строку таблицы | Highlight-эффект на всю строку |

## Идеи для расширения

- **Реальный API** — заменить `mockData.ts` на fetch/SWR
- **React Router** — роутинг для страниц Analytics, Orders, Products
- **Дополнительные графики** — Heatmap по часам, Funnel-диаграмма
- **Фильтры** — по категории, стране, каналу трафика
- **localStorage persist** — Zustand persist middleware для темы
- **Анимация чисел** — counter animation при смене периода

## See Also

- [Архитектура](architecture.md) — структура папок и правила зависимостей
- [State Management](state-management.md) — как работает Zustand store
