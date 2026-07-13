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

# Build-time (inlined) env: ARG -> ENV before `next build`.
# turbo.json globalEnv declares NEXT_PUBLIC_* so Turbo 2 strict env-mode passes these through.
ARG APP=web
ARG NEXT_PUBLIC_API_SERVER_URL
ARG NEXT_PUBLIC_SWARM_GATEWAY_URL
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
ENV NEXT_PUBLIC_API_SERVER_URL=$NEXT_PUBLIC_API_SERVER_URL \
    NEXT_PUBLIC_SWARM_GATEWAY_URL=$NEXT_PUBLIC_SWARM_GATEWAY_URL \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=$NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID \
    NEXT_PUBLIC_POSTHOG_KEY=$NEXT_PUBLIC_POSTHOG_KEY \
    NEXT_PUBLIC_POSTHOG_HOST=$NEXT_PUBLIC_POSTHOG_HOST \
    NEXT_TELEMETRY_DISABLED=1 \
    TURBO_TELEMETRY_DISABLED=1

RUN node_modules/.bin/turbo run build --filter=@openrun/${APP}

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
