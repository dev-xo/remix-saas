![GitHub-Mark-Light](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Intro-Light.png#gh-light-mode-only)
![GitHub-Mark-Dark ](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Intro-Dark.png#gh-dark-mode-only)

<p align="center">
  <p align="center">
    <a href="https://stripe-stack.fly.dev">Live Demo</a>
    ·
    <a href="https://github.com/dev-xo/dev-xo/tree/main/stripe-stack/docs">Deployment Documentation</a>
    ·
    <a href="https://twitter.com/DanielKanem">Twitter</a>
    <br/>
    <br/>
    A Stripe focused Remix Stack that integrates User Subscriptions, Authentication and Testing. Driven by Prisma ORM. Deploys to Fly.io 
  </p>
</p>

## Features

- [Fly app Deployment](https://fly.io) with [Docker.](https://www.docker.com/products/docker-desktop/)
- Database ORM with [Prisma.](https://www.prisma.io/)
- Production Ready with [SQLite](https://sqlite.org/index.html) and [PostgreSQL.](https://www.postgresql.org/)
- [GitHub Actions](https://github.com/features/actions) for Deploy on merge to Production and Staging environments.
- Styling with [Tailwind.css](https://tailwindcss.com/) + [Tailwind Prettier-Plugin.](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- Healthcheck Endpoint for [Fly backups Region Fallbacks.](https://fly.io/docs/reference/configuration/#services-http_checks)
- E2E testing with [Playwright.](https://playwright.dev)
- Linting with [ESLint.](https://eslint.org/)
- Code formatting with [Prettier.](https://prettier.io/)
- Static Types with [TypeScript.](https://www.typescriptlang.org/)

### Implemented Features

- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview) with support for multiple plans, [Upgrade / Downgrade](https://stripe.com/docs/billing/subscriptions/change) and [Customer Portal.](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- Authentication Ready with [Remix-Auth](https://www.npmjs.com/package/remix-auth) that includes: [Socials Strategies](https://www.npmjs.com/package/remix-auth-socials) and [Form Strategy.](https://github.com/sergiodxa/remix-auth-form)
- Flat Routes from [Remix Flat Routes.](https://github.com/kiliman/remix-flat-routes)
- Forms validation for Client and Server side with [Conform.](https://conform.guide/)
- Support for Javascript developers with continuous updates over time based on `remix.init`.

Learn more about [Remix Stacks](https://remix.run/stacks).

## Quickstart

Stripe Stack has support for multiple databases based on Prisma. The installer will prompt a selector allowing you to choose the database your project will run on. Deployment files will be updated matching the required criteria to successfully deploy to Fly.io

To get started, run the following commands in your console:

```sh
# Initialize template in your workspace:
npx create-remix@latest --template dev-xo/stripe-stack

# Select the database your project will run on:
# > SQLite or PostgreSQL

# Start dev server:
npm run dev
```

> Important❗️: Cloning the repository instead of initializing it with the above commands, will result in a inappropriate experience. This template uses `remix.init` to configure itself and prepare your environment.

## Getting Started

The following section will be divided into three quick threads: **Live Demo**, **Development** and **Production**.

## Live Demo

Template demo has been built to be really simple to test, being able to display all its provided features. Here is a simple workflow you can follow to give it a try:

1. Log in with your preferred authentication method.
2. Select a subscription plan.
3. Fill Stripe checkout inputs with default development values. _(Check Notes)_
4. You should be redirected back to the app with selected plan already set.

> **Note**
> Stripe test mode uses the following number: `4242` as valid value for Card Information. Type it as much times as you can on each available input to successfully complete the checkout step.

## Development

Understanding our development workspace will keep us productive.

### Usage

Template can be used in the way you like. Feel free to remove all the HTML code you don't need, keeping just the `loaders` and `actions` from Remix.

### Prisma Migrations

If your database choice was PostgreSQL, you will need to run Prisma migrations with your Postgres client running on the background. In order to accomplish this, remove the folder inside `/prisma` called `/migrations`, and run `npx prisma migrate dev --name init` to properly setup them.

### Package Manager

If you are using `PNPM` Package Manager, probably you will have to deal with some `Prisma` module imports issues. Feel free to have a search on google about this topic.

We strongly recommend using `npm` or `yarn` instead.

### Authentication

Stripe Stack provides Social and Form Authentication methods.

### Social Authentication

To start using Social Authentication, we'll need to get the secret API Keys from the following providers. Below here you can find all template's providers OAuth Documentations.

[Google Docs](https://developers.google.com/identity/protocols/oauth2) ◆ [Twitter Docs](https://developer.twitter.com/en/docs/authentication/overview) ◆ [GitHub Docs](https://docs.github.com/es/developers/apps/building-oauth-apps/authorizing-oauth-apps) ◆ [Discord Docs](https://discord.com/developers/docs/topics/oauth2)

Usually this Providers will require a `Callback URI / Redirect URL`. An example of a Callback URI for this template looks like the following one: `https://my-deployed-app.fly/auth/provider/callback`.

Replace `/provider` with the one you are trying to setup. Available providers are: `google`, `twitter`, `github` and `discord`. Remember to set your provider API Keys into template's `.env` file.

### Form Authentication

Using this method is pretty straightforward. The only thing you have to know is that, in order to allow the user recover its password, we'll need to use an Email Service.

This template uses [Sendinblue](https://www.sendinblue.com), a free email service that does not require Credit Card for registration, either use. It's limited to 300 emails per day, but it's good enough for development propouses.

Let's see how we can set up this service:

1. Create an account at [Sendinblue](https://www.sendinblue.com).
2. Go to navigation menu and click on `SMTP & API`.
3. Create and Copy the provided API Key.
4. Paste the provided API Key into template `.env` file as `EMAIL_PROVIDER_API_KEY`.

### Stripe Webhook - Development

In order to start receiving Stripe Events to our Webhook Endpoint, you will have to install [Stripe CLI.](https://stripe.com/docs/stripe-cli) Once installed, keep the following command running on the background:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

The above command will provide a `Webhook Signing Secret` that has to be set in template `.env` file as `DEV_STRIPE_WEBHOOK_ENDPOINT_SECRET`.

### Stripe Products

From [Stripe Dashboard](https://dashboard.stripe.com/test/products), create as many products as you want. Remember to update their secret API Keys in template `.env` as well as the product descriptions from `/services/stripe/plans`.

## Production

### Stripe Webhook - Production

In order to start receiving Stripe Events to our deployed app, we'll need to setup our Production Webhook:

1. Visit [Stripe Dashboard.](https://dashboard.stripe.com/test/webhooks)
2. Create a new Webhook Endpoint.
3. Set your deployed app Webhook URL into `Endpoint URL` input. _(Check Notes)_
4. Reveal the `Signing Secret` value that has been provided from Stripe Webhook page and set it as `PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET` into template `.env` file.

> **Note**
> Example of a Deployed Webhook Endpoint URL: https://deployed-app.fly.dev/api/webhook

## Deployment

Stripe Stack has support for SQLite and PostgreSQL databases. In order to keep a better track and an easier maintenance of each deployment documentation, we moved each one to its own file.

Check [SQLite DEPLOYMENT](https://github.com/dev-xo/dev-xo/blob/main/stripe-stack/docs/SQLITE-DEPLOYMENT.md) or [PostgreSQL DEPLOYMENT](https://github.com/dev-xo/dev-xo/blob/main/stripe-stack/docs/POSTGRESQL-DEPLOYMENT.md) in order to get your app to production.

## GitHub Actions

GitHub Actions are used for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests, build, etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Playwright

We use Playwright for our End-to-End tests. You'll find those in `tests/e2e` directory. To run your tests in development use `npm run test:e2e:dev`.

### Type Checking

This template uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project use `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting. It's recommended to install an editor plugin to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

This template has pre-configured prettier settings on `.package-json`. Feel free to update each value with your preferred work style.

## Support

If you find this template useful, support it with a [Star ⭐](https://github.com/dev-xo/stripe-stack)<br />
It helps the repository grow and gives me motivation to keep working on it. Thanks you!

## License

Licensed under the [MIT license](https://github.com/dev-xo/stripe-stack/blob/main/LICENSE).
