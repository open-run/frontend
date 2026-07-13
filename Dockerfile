# syntax=docker/dockerfile:1
#
# Parameterized multi-stage build for the OpenRun frontend monorepo.
# Build one image per app:  docker build --build-arg APP=web   -t openrun-web   .
#                           docker build --build-arg APP=admin -t openrun-admin .
#
# Yarn 4 is invoked directly from the committed release (no corepack) for a hermetic install.
# Both next.config.js set `output: 'standalone'` with outputFileTracingRoot at the monorepo root,
# so the standalone bundle mirrors the repo root and the entrypoint lands at apps/<APP>/server.js.

########################################
# Stage 1: install + build
########################################
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install layer: copy only manifests so `yarn install` caches until deps change.
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
COPY apps/web/package.json apps/web/package.json
COPY apps/admin/package.json apps/admin/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/api-client/package.json packages/api-client/package.json
COPY packages/ui/package.json packages/ui/package.json
RUN node .yarn/releases/yarn-4.0.2.cjs install --immutable

# Source.
COPY . .

ARG APP=web
ENV NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1

# Build-time env is supplied as a BuildKit secret (id=appenv) — the whole prod .env
# for this app. It is never baked into a layer. We materialize it as
# apps/<APP>/.env.production so `next build` auto-loads it (inlining NEXT_PUBLIC_* into
# the client bundle). `next build --output standalone` copies .env.production into
# .next/standalone too, so we delete EVERY copy under apps/<APP> in the same RUN — the
# source and the traced standalone copy — leaving no server-only key in any layer.
RUN --mount=type=secret,id=appenv \
    cp /run/secrets/appenv apps/${APP}/.env.production && \
    node_modules/.bin/turbo run build --filter=@openrun/${APP} && \
    find apps/${APP} -name '.env.production' -delete

########################################
# Stage 2: runtime
########################################
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nodejs && adduser -S -u 1001 -G nodejs nextjs

ARG APP=web
# The standalone bundle mirrors the monorepo root; copy it AS the app root.
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/standalone ./
# static/ and public/ are not traced into standalone — place them next to server.js's .next.
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/.next/static ./apps/${APP}/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP}/public ./apps/${APP}/public

USER nextjs
WORKDIR /app/apps/${APP}
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=15s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
