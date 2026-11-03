# Maintenance refresh — 3 November 2026

## Run locally

Use Node 24 LTS (`nvm use`) and npm:

```sh
npm ci
npm run setup
npm run dev
```

Setup uses the environment initializer in the existing `remix.init/index.js`. It preserves an existing `.env`, otherwise creates one from `.env.example` with cryptographically random secrets. It generates the Prisma client, initializes local SQLite, and upserts roles, permissions, a local admin, and local pricing plans. Repeated setup does not duplicate records. Relative SQLite URLs retain the old convention of resolving against the `prisma` directory; both Prisma CLI and runtime use the same absolute path.

Enter any email address at `/auth/login`; read its code or magic link in the server terminal. The local admin email is `admin@admin.com`. Local mock mode does not bypass code verification. GitHub login is hidden and its route returns 404 without credentials. Google OAuth was not implemented in the original app and has not been added.

`MOCK_SERVICES=true` simulates email delivery and subscription creation/upgrades in SQLite. It never contacts Stripe or Resend. Webhooks return 503 in this mode. The real Stripe portal is unavailable; the local portal action returns to billing. Mock mode is explicitly rejected when `NODE_ENV=production`.

## Dependency choices

| Area                             | Selected version      | Reason                                                                                                  |
| -------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------- |
| Remix packages                   | 2.17.5                | Latest published Remix v2; no Remix v3/React Router v7 migration                                        |
| React / React DOM                | 18.3.1                | Remix v2 declares React 18 peers                                                                        |
| Vite                             | 6.4.5                 | Latest v6 patch accepted by Remix v2's Vite peer range                                                  |
| Express                          | 4.22.3                | Latest v4 patch; Remix's Express adapter requires v4                                                    |
| Prisma / client / SQLite adapter | 7.10.1                | Latest stable v7; preserves SQLite with the libSQL adapter and moves CLI settings to `prisma.config.ts` |
| Zod / Conform                    | 4.6.7 / 1.21.3        | Patched validation with Conform's `/v4` entry point                                                     |
| Remix Auth / TOTP / GitHub       | 4.2.0 / 4.0.0 / 3.0.2 | Current APIs; application manages signed user sessions and signs the complete TOTP cookie state         |
| Stripe                           | 23.1.0                | Current SDK; uses its default matching API version and subscription-item billing periods                |
| Tailwind / tailwind-merge        | 3.4.19 / 2.6.1        | Keeps the current UI and Tailwind v3 class semantics                                                    |
| remix-utils / remix-i18next      | 7.7.0 / 6.4.1         | Last compatible Remix v2 releases; newer majors target React Router v7                                  |
| i18next / react-i18next          | 23.16.8 / 15.7.4      | Peer range required by remix-i18next v6                                                                 |
| TypeScript / ESLint              | 5.9.3 / 9.39.5        | Compatible framework/plugin peer ranges; ESLint uses flat configuration                                 |
| Vitest / coverage                | 5.1.0                 | Current matching test and coverage versions                                                             |

GitHub Actions use [checkout v7.0.1](https://github.com/actions/checkout/releases/tag/v7.0.1) and [setup-node v7.1.0](https://github.com/actions/setup-node/releases/tag/v7.1.0) on the hosted Ubuntu runner.

Other direct runtime and development dependencies were advanced to their current compatible releases. The unused React Email preview CLI and Fly Dockerfile generator were removed. The existing UI structure and styling are retained.

The manifest documents a small set of overrides: compatible Router v6 and internal-router patches, the current React Email renderer inside its component package, patched tar and ESTree conversion, and Zod v4 for the optional remix-utils peer. The used remix-utils paths (CSRF, honeypot, hydration, locale parsing, redirect validation) do not use its Zod v3-specific typed-session helpers. Regression and HTTP tests cover the application's actual paths; adopting those unused helpers would require another compatibility review.

## Security status

This is **not a clean audit**. At verification, `npm audit` reports **30 affected packages: 21 moderate, 9 high, 0 critical**. Package counts include parent packages affected through shared transitive dependencies; they are not 30 independent vulnerabilities.

Remaining runtime findings include:

- `turbo-stream` v2, pinned by Remix v2's single-fetch protocol: [GHSA-rxv8-25v2-qmq8](https://github.com/advisories/GHSA-rxv8-25v2-qmq8). Single Fetch remains enabled. A forced v3 override would change the serialization protocol.
- Router v6 pinned by Remix v2: [backslash navigation redirect](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6), [SSR error deserialization](https://github.com/advisories/GHSA-337j-9hxr-rhxg). The reviewed fixes target Router v7 rather than a compatible Remix v2 dependency set.

Build-tool findings include old esbuild and nested Vite versions in Remix's compiler/Vanilla Extract dependencies, the TOML frontmatter parser, and glob/minimatch versions required by Remix and lint tooling. These are retained and recorded, rather than forcing incompatible major APIs merely to reduce the audit count. Build only trusted repository source and keep development servers local.

Run `npm audit` directly to review current findings. The custom audit checker and allowlist have been removed. CI runs application checks and smoke tests; it does not gate these known audit findings. Production deployment with the remaining runtime findings requires a team decision; this refresh does not deploy the application.

## Verification

```sh
npm run check
npm run test:smoke
npm audit
```

`check` runs ESLint, TypeScript, regression tests, and the client/server production build. The smoke test in `tests/integration/smoke.test.js` uses the compiled server and an isolated database, applies the checked-in migration, seeds twice, and verifies email-code and magic-link authentication, onboarding, protected/admin routes, profile changes, avatar upload/read/reset, theme persistence, local subscription upgrades, and logout. Browser testing also covers client-side login, onboarding, and dashboard navigation.

Real GitHub OAuth, real email delivery, Stripe checkout/portal, and provider webhook events are not verified without credentials. Docker deployment is updated for Node 24 and Prisma configuration but has not been run as part of local verification.

## Real services and deployment

Set `MOCK_SERVICES=false`; provide session/encryption/honeypot secrets, `DATABASE_URL`, `PROD_HOST_URL`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_ENDPOINT`. GitHub credentials are optional. Match your Stripe webhook endpoint API version to the installed SDK's API version before using real events; this update moves beyond the old 2024 API shape.

Use `npm run build`, `npx prisma migrate deploy`, `npx prisma db seed`, then `npm start` with real configuration. Do not run the local `setup` script against production. The Docker entrypoint applies migrations and the repeatable seed before starting. For an existing database created outside migrations, back it up and baseline the initial migration using Prisma's existing-database workflow before `migrate deploy`; do not reset it.

A production-build local smoke run intentionally uses `NODE_ENV=test`, so mocks remain isolated from real production mode. No external secrets are checked in; `.env` and local database files stay ignored.
