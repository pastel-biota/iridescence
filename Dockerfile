FROM node:24-alpine AS base
RUN mkdir /app;
RUN corepack enable;
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app
WORKDIR /app

FROM base AS builder
RUN pnpm install --frozen-lockfile;
COPY . /app/
RUN pnpm run build;

FROM base
RUN pnpm install --frozen-lockfile --prod;
COPY --from=builder /app/build /app/build
CMD ["pnpm", "run", "start"]
