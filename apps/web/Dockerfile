FROM node:22-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/
COPY packages/contracts/package.json packages/contracts/

RUN npm ci --workspace=apps/web --workspace=packages/contracts --ignore-scripts

# web imports @pulse/contracts (tsconfig paths → ../../packages/contracts/src),
# so the contracts source must be present for `tsc -b && vite build`.
COPY packages/contracts packages/contracts
COPY apps/web apps/web

WORKDIR /app/apps/web
RUN npm run build

FROM nginx:alpine AS runner

COPY --from=base /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
