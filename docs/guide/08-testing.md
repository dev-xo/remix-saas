# Testing

Run `npm run check` for lint, TypeScript, Vitest regression tests, and a production build. Run `npm run test:smoke` after building for HTTP checks against the compiled server with an isolated temporary SQLite database. Neither command needs external service credentials.

Vitest tests live in `tests/integration/*.test.{js,ts,tsx}` and are configured in `vitest.config.ts`. They verify environment validation, production mock rejection, signed login state, email rendering, and offline delivery.

The smoke suite verifies migrations and repeatable seeding, public pages, protected routes, missing OAuth configuration, CSRF rejection, email-code and magic-link authentication, onboarding, admin permissions, profile updates, avatar upload/read/reset, theme persistence, mocked subscription upgrades, and logout. It starts and stops its own server and removes its temporary database.

Use `npm run test:watch` while developing, `npm run test:coverage` for coverage, and `npm audit` to review dependency findings. The built-app test is skipped by default; `npm run test:smoke` enables it after a build. Real OAuth, Resend delivery, Stripe payments/portal, and webhook delivery require provider credentials and are not exercised by local mocks.
