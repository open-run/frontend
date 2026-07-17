# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

OpenRun frontend — a web3 running-community app ("벙" = local running meetups, challenges, and NFT
rewards). The same codebase serves both a normal browser and a React Native WebView (mobile app).
Backend is a separate Spring Boot service reached over REST + JWT. Chain is Base Sepolia (testnet).
Most code comments and product copy are in Korean.

## Monorepo layout

Turborepo + Yarn 4 workspaces (`nodeLinker: node-modules`, not PnP). Node 20+ (`.nvmrc`), enable
with `corepack enable`.

- `apps/web` (`@openrun/web`) — main user app, dev port **6050**
- `apps/admin` (`@openrun/admin`) — admin console, dev port **6051**
- `packages/api-client` (`@openrun/api-client`) — axios client factory, auth, cookie helpers, shared API types
- `packages/types` (`@openrun/types`) — shared TS types
- `packages/ui` (`@openrun/ui`) — shared components (Avatar, Modal, RarityIcon, Category, LoadingLogo), icons, Tailwind preset, color tokens

Packages are consumed as **raw TypeScript source** (`"main": "./src/index.ts"`), not built artifacts.
Each app must list them in `transpilePackages` in `next.config.js`.

## Commands

Run from the repo root (Turbo fans out to all workspaces):

```bash
yarn dev          # all apps (web :6050, admin :6051)
yarn build        # production build, respects ^build dependency order
yarn lint         # eslint across workspaces
yarn typecheck    # tsc --noEmit across workspaces
```

Target a single app:

```bash
yarn workspace @openrun/web dev        # or build / lint / typecheck / lint:fix
yarn workspace @openrun/admin typecheck
```

There is **no test framework** in this repo — do not invent test commands or `*.test.*` files.
`lint:fix` exists only on the apps (`web`, `admin`), not the packages. Typecheck (`tsc --noEmit`)
is the primary correctness gate.

## API layer convention (the most important pattern)

Each backend resource lives under `src/apis/v1/<resource>/...`, with route-param folders mirroring
Next routing (`[bungId]`, `[userId]`). A resource is split into up to three files:

- `index.ts` — request/response **types** plus the bare axios function (e.g. `fetchBungs`). These call
  `http` from `@apis/axios` and are typed to return the **unwrapped body** (`Promise<ResponseType>`).
- `query.ts` — TanStack Query read hooks (`useXQuery`, usually `useSuspenseQuery`) and an exported
  query-key constant (e.g. `export const BUNGS_QUERY_KEY = 'fetchBungs'`).
- `mutation.ts` — TanStack mutation hooks.

When adding an endpoint, follow this triplet exactly. Reuse the query-key constant for invalidation.

### The HTTP client (`@openrun/api-client`)

`createApiClient({ baseURL, cookieName })` builds an axios instance; the default export `http`
(baseURL = `NEXT_PUBLIC_API_SERVER_URL`) is what apps import via the `@apis/axios` alias. Two
interceptors define the contract:

- **Request**: strips `null`/`undefined` params, then injects `Authorization` from the `ACCESSTOKEN`
  cookie — read via `next/headers` cookies on the server, `document.cookie` in the browser. Works in
  both SSR and client contexts automatically.
- **Response**: returns `response.data` directly. So API functions get the JSON body, not an
  `AxiosResponse`. Backend wraps payloads in `ApiResponse<T>` / `PaginationResponse<T>` (from
  `@apis/type`); type your functions accordingly.

`apps/web/src/apis/http.server.ts` is the SSR-only variant. BFF map/weather calls live under
`src/apis/maps/` and `src/apis/weather/` and hit the local proxy routes, not the backend directly.

## Auth & routing

Smart-wallet login: Reown AppKit / WalletConnect connects an address → `GET /v1/users/login/smart_wallet?code=`
returns a `jwtToken` → stored in the `ACCESSTOKEN` cookie. `src/middleware.ts` guards an **explicit
matcher list** (not a catch-all) and redirects token-less requests to `/signin`. If you add a route
that must be authenticated, add it to the `matcher` array.

## BFF proxies hide server-only keys

`apps/web/src/app/api/{geocoding,reverse-geocoding,places,weather}/route.ts` are server-only proxies
that use `GOOGLE_API_KEY` / `OPENWEATHER_API_KEY`. Never reference these keys from client code; call
the proxy route instead. `NEXT_PUBLIC_*` keys (`API_SERVER_URL`, `GOOGLE_MAPS_API_KEY`,
`WALLETCONNECT_PROJECT_ID`) are browser-exposed by design. Copy `.env.example` → `.env`.

## Path aliases — watch the overrides

Aliases are defined in each app's `tsconfig.paths.json` (web) / `tsconfig.json` (admin). Standard
ones map into `src/` (`@/*`, `@components/*`, `@shared/*`, `@hooks/*`, `@contexts/*`, `@store/*`,
`@utils/*`, `@constants/*`, `@styles/*`, `@icons/*`). **But several specific aliases are remapped into
the workspace packages** and take precedence over the wildcard — e.g. `@apis/axios` → api-client,
`@type/*` → packages/types, `@shared/Modal` / `@shared/Avatar` / `@shared/LoadingLogo` → packages/ui,
`@styles/colors` → packages/ui, and (admin) `@constants/cookie` / `@utils/cookie` → api-client.
So a `@shared/...` or `@constants/...` import may resolve into a package, not the local `src/`. Before
moving or creating a "shared" component/util, check whether an explicit alias already points it at a
package. Prettier import-order grouping (`.prettierrc.json`) follows these alias prefixes.

## Mobile WebView bridge

One codebase runs in browser and in a RN WebView. `apps/web/src/components/shared/AppBridge.tsx` is the
hub:

- `checkIsApp()` detects the WebView (`window.ReactNativeWebView`, iOS `webkit.messageHandlers`, Android
  `wv` UA). On detection it sets `useAppStore().isApp = true` and toggles `document.body.classList` →
  `app`. That class drives the Tailwind **`app:` variant** (e.g. `pb-16 app:pb-40`) for WebView-only styling.
- Native → web messages arrive on both `window` and `document` `message` events; payloads are JSON
  strings matching the `MESSAGE` enum in `@constants/app` (e.g. `INSET` carries safe-area insets stored
  in `useAppStore().insets`).
- `postMessageToRN(payload)` sends web → native. `useMessageHandler(fn)` subscribes a component to
  native messages (no-op unless `isApp`).
- `eruda` mobile console is injected only in development.

## State & providers

Zustand stores in `src/store/` (`user`, `app`, `theme`, `image`, `permission`) for client state;
TanStack Query for server state; `nuqs` for URL state. App-wide providers in `src/contexts/`
(`WalletProvider`, `ModalProvider`, `GoogleMapContext`, `ReactQueryProvider`).

## Conventions

- Prettier: **no semicolons**, single quotes (incl. JSX), `printWidth: 120`, trailing commas. Import
  order is auto-sorted by `@trivago/prettier-plugin-sort-imports` + `prettier-plugin-tailwindcss`.
- ESLint extends `next` + `prettier`; `import/no-unresolved` and `import/export` are disabled (because
  of the cross-package aliasing above).
- `tokenId` is an ERC-1155 id stored as a string and can exceed `Number.MAX_SAFE_INTEGER`. **Never**
  parse it to a JS number — keep it a string in keys, requests, and comparisons.

## Deploy

Push to `main` triggers `.github/workflows/deploy.yml`: it builds the per-app Docker images
(`Dockerfile`, `ARG APP=web|admin`, standalone output), pushes them to Artifact Registry, and
SSH-deploys the containers onto the shared GCP Compute Engine VM — `web` and `admin` run as separate
containers on the internal Docker network alongside the backend, health-gated on `/api/health`.
Cloudflare fronts the public domains (`open-run.xyz`, `admin.open-run.xyz`) and terminates TLS.
Build- and run-time config for each app comes from a single base64 `.env` GitHub secret (`WEB_ENV` /
`ADMIN_ENV`); see `apps/*/.env.example` for the keys and format constraints.

## Active work

`handover.md` (repo root) documents an in-progress NFT migration from GCS-backed items to Swarm-backed
NFTs: item identity moved from numeric `nftItemId` to string `tokenId`, and catalog image URLs now point
at a Swarm gateway (`api.gateway.ethswarm.org`) with the raw `storageKey` fields removed. If you touch
NFT/avatar code, read it first — and note `apps/web/next.config.js` `images.remotePatterns` may still
need the Swarm gateway host added.
