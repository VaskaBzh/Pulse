FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/

RUN npm ci --workspace=apps/web --ignore-scripts

COPY apps/web apps/web

WORKDIR /app/apps/web
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=base /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
