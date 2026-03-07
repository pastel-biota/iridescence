FROM node:24-alpine AS base
RUN mkdir /app;
RUN corepack enable;
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml /app
WORKDIR /app

FROM base AS builder
COPY . /app/
RUN pnpm install --frozen-lockfile;

ARG VITE_MEMBRANE_BASE_URL
ENV VITE_MEMBRANE_BASE_URL=${VITE_MEMBRANE_BASE_URL}
RUN pnpm run build;

FROM base
RUN pnpm install --frozen-lockfile --prod;
COPY --from=builder /app/build /app/build
CMD ["pnpm", "run", "start"]
