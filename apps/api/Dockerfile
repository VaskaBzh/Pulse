FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY packages/contracts/package.json packages/contracts/

RUN npm ci --workspace=apps/api --workspace=packages/contracts

COPY packages/contracts packages/contracts
COPY apps/api apps/api

WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/apps/api/dist ./dist
COPY --from=base /app/apps/api/prisma ./prisma
COPY --from=base /app/apps/api/node_modules/.prisma ./node_modules/.prisma
COPY --from=base /app/apps/api/package.json ./

EXPOSE 3000
CMD ["node", "dist/main"]
