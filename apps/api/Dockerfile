FROM node:22-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages/contracts/package.json packages/contracts/

RUN npm ci --workspace=apps/api --workspace=packages/contracts --ignore-scripts
RUN npm rebuild @prisma/engines @prisma/client prisma

COPY packages/contracts packages/contracts
COPY apps/api apps/api

WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/prisma ./prisma
COPY --from=base /app/apps/api/package.json ./

# nest build bundles everything into a single dist/main.js, which breaks Prisma's
# runtime engine auto-discovery (it resolves paths relative to the bundle's
# __dirname). Point it at the engine directly.
ENV PRISMA_QUERY_ENGINE_LIBRARY=/app/node_modules/.prisma/client/libquery_engine-linux-musl-openssl-3.0.x.so.node

EXPOSE 3000
CMD ["node", "dist/main"]
