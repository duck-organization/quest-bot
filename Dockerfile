FROM node:24-alpine AS builder
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/bot/package.json ./apps/bot/package.json
COPY apps/bot/prisma ./apps/bot/prisma/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter @duckorganization/questbot build

FROM node:24-alpine
WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY apps/bot/package.json ./apps/bot/package.json
COPY apps/bot/prisma.config.ts ./apps/bot/prisma.config.ts
COPY apps/bot/prisma ./apps/bot/prisma/
RUN pnpm install --prod --frozen-lockfile --filter @duckorganization/questbot

COPY --from=builder /app/apps/bot/dist ./apps/bot/dist

CMD ["sh", "-c", "pnpm --filter @duckorganization/questbot db:push && pnpm --filter @duckorganization/questbot start"]
