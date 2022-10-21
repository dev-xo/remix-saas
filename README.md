![GitHub-Mark-Light](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Logo-White-Template.png#gh-light-mode-only)
![GitHub-Mark-Dark ](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Dark-White-Template.png#gh-dark-mode-only)

<p align="center">
  <p align="center">
    <a href="https://stripe-stack.fly.dev">Live Demo</a>
    ·
    <a href="https://github.com/dev-xo/dev-xo/blob/main/stripe-stack/docs/SQLITE-DEPLOYMENT.md">Deployment Documentation</a>
    ·
    <a href="https://twitter.com/DanielKanem">Twitter</a>
    <br/>
    <br/>
    A Stripe focused Remix Stack that integrates Subscriptions, Authentication and Testing. Support for SQLite and PostgreSQL. Deploys to Fly.io 
  </p>
</p>

## Features

Stripe Stack has been built on top of [Barebones Stack](https://github.com/dev-xo/barebones-stack), including all its base features.

### Base Features

- [Fly app Deployment](https://fly.io) with [Docker.](https://www.docker.com/products/docker-desktop/)
- Database ORM with [Prisma.](https://www.prisma.io/)
- Production Ready with [SQLite](https://sqlite.org/index.html) and [PostgreSQL.](https://www.postgresql.org/)
- [GitHub Actions](https://github.com/features/actions) for Deploy on merge to Production and Staging environments.
- Styling with [Tailwind.css](https://tailwindcss.com/) + [Tailwind Prettier-Plugin.](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- Healthcheck Endpoint for [Fly backups Region Fallbacks.](https://fly.io/docs/reference/configuration/#services-http_checks)
- End-to-End testing with [Playwright.](https://playwright.dev)
- Unit Testing with [Vitest](https://vitest.dev) and [Testing Library.](https://testing-library.com)
- Local third party request mocking with [MSW.](https://mswjs.io)
- Linting with [ESLint.](https://eslint.org/)
- Code formatting with [Prettier.](https://prettier.io/)
- Static Types with [TypeScript.](https://www.typescriptlang.org/)

### Implemented Features

- Authentication Ready with [Remix-Auth](https://www.npmjs.com/package/remix-auth) that includes: [Socials Strategies](https://www.npmjs.com/package/remix-auth-socials) and [Form Strategy.](https://github.com/sergiodxa/remix-auth-form)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview) with support for [Multiple Plans](#), [Upgrade / Downgrade](https://stripe.com/docs/billing/subscriptions/change) and [Customer Portal.](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- Support for Javascript developers with continuous updates over time based on `remix.init`.

Learn more about [Remix Stacks](https://remix.run/stacks).

## Quickstart

Stripe Stack has support for multiple databases based on Prisma. The installer will prompt you to select the database your project will run on. Based on this choice, deployment files will be updated, allowing a successfull deploy to Fly.io

To get started, run the following commands in your console:

```sh
# Initialize template in your workspace:
npx create-remix@latest --template dev-xo/stripe-stack

# You will be prompted to select the database your project will run on.
# ...

# Start dev server:
npm run dev
```

> Notes: Important❗️: Cloning the repository instead of initializing it with the above commands, will result in a inappropriate experience. This template uses `remix.init` to configure itself and prepare your environment.

## Getting Started

The following section will be splitted into three quick threads: **Live Demo**, **Development** and **Production**.

## Live Demo

Template's Demo has been built to be really simple to test, being able to show all its provided features. Here is the workflow we can follow to test it:

1. Log in with your preferred authentication method.
2. Select a Subscription Plan.
3. Fill Stripe Checkout inputs with default development values. _(Check Notes)_

Done! We should be redirected back to the app with selected Stripe Plan already set.

> Notes: Stripe test mode uses the following number: `4242` as valid values for Card Information. Type it as much times as you can on each available input to successfully complete Checkout step.

## Development

Understanding our development workspace will keep us productive.

### Usage

Template can be used in the way you like. Remove all the HTML code you don't need keeping just the `loaders` and `actions` from Remix. Code that is necessary for the template to keep working as expected, has been marked as `@required`.

### Prisma Migrations

If your database choice was PostgreSQL, you will need to run Prisma migrations with your Postgres client running on the background. In order to accomplish it, feel free to remove the folder inside `/prisma` called `/migrations`, and run `npx prisma migrate dev --name init` to properly setup them.

### Folder Structure

Let's review some of template's important folders:

    ├── models          # Stores database interactions.
    ├── services        # Stores sessions, configs, utils and template initializers.
      ├──                 This folder could also be called "lib" or "modules".

    ├── routes
      ├── api           # Stores Stripe Webhook Endpoint, and any realted API call.
      ├── resources     # Stores app logic, redirects and session updates.

### Authentication

Stripe Stack provides Social and Form Authentication.

### Social Authentication

To start using Social Authentication, we'll need to get the secret API Keys from the following Providers.
Below here you can find all template's Providers OAuth Documentations.

- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth](https://developer.twitter.com/en/docs/authentication/overview)
- [Github OAuth](https://docs.github.com/es/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Discord OAuth](https://discord.com/developers/docs/topics/oauth2)

Usually Social Providers will ask you for a `Callback URI / Redirect URL`. An example of a Callback URI would look like the following one: `https://my-deployed-app.fly/auth/provider/callback`.

Replace `/provider` with the one you are trying to setup. Available providers are: `google`, `twitter`, `github` and `discord`. Remember to set your Provider API Keys into template's `.env` file.

### Email / Password Authentication

Using this method is pretty straightforward. The only thing we have to know is that in order to allow the user recover its password, we'll need to setup an Email Service.

For this template we'll use [Sendinblue](https://www.sendinblue.com), an Email Service that does not require Credit Card for registration, either use. It's limited to 300 Emails per day, but it's good enough for development propouses.

Let's see how we can set up this service:

1. Create an account at [Sendinblue](https://www.sendinblue.com).
2. Go to Menu, and click on `SMTP & API`.
3. Create and Copy an API Key.

Done! Paste it into template's `.env` file as `EMAIL_PROVIDER_API_KEY`.

### Stripe Webhook - Development

In order to start receiving Stripe Events to our Webhook Endpoint, we'll have to install [Stripe CLI.](https://stripe.com/docs/stripe-cli) Once installed, keep the following command running on your background:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

The above command will provide us with a `Webhook Signing Secret` that has to be set in template's `.env` as `DEV_STRIPE_WEBHOOK_ENDPOINT_SECRET`.

### Stripe Products

From [Stripe Products Dashboard](https://dashboard.stripe.com/test/products), create as many products as you want. Remember to update their secret API Keys in template's `.env` as well as the product descriptions from `/services/stripe/stripe-plans`.

## Production

### Stripe Webhook - Production

In order to start receiving Stripe Events to our deployed app, we'll need to setup our Production Webhook:

1. Visit [Stripe Dashboard Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Create a new Webhook Endpoint.
3. Set your deployed app Webhook Endpoint URL into `Endpoint URL` input. _(Check Notes)_
4. Reveal the `Signing Secret` value that has been provided from Stripe Webhook page and set it as `PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET` in template's `.env` file.

> Notes: This is an example of a Deployed Webhook Endpoint URL: https://my-deployed-app.fly.dev/api/webhook

## Deployment

Stripe Stack has support for SQLite and PostgreSQL. In order to keep a better track and an easier maintenance of each deployment documentation, we moved each one to its own file.

Check [SQLite DEPLOYMENT.md](https://github.com/dev-xo/dev-xo/blob/main/stripe-stack/docs/SQLITE-DEPLOYMENT.md) or [PostgreSQL DEPLOYMENT.md](https://github.com/dev-xo/dev-xo/blob/main/stripe-stack/docs/POSTGRESQL-DEPLOYMENT.md) to get your app to production.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests, build, etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Playwright

We use Playwright for End-to-End tests. You'll find those in the `tests/e2e` directory. As you make changes, add to an existing file or create a new file in the `tests/e2e` directory to test your changes.

To run these tests in development, run `npm run test:e2e:dev`.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

To run these tests in development, run `npm run test` or `npm run test:cov` to get a detailed summary of your tests.

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

This template has pre-configured prettier settings on `.package-json`. Feel free to update each value with your preferred work style.

## Contributing

Contributions are Welcome! Jump in and help us improve this Community Template over time!

- [Contributing Guide](https://github.com/dev-xo/dev-xo/blob/main/stripe-stack/docs/CONTRIBUTING.md) Docs.
- [Public Project Roadmap](https://github.com/users/dev-xo/projects/5) Check template's TODOs, fixes and updates.

## Support

If you find this template useful, support it with a [Star ⭐](https://github.com/dev-xo/stripe-stack)<br />
It helps the repository grow and gives us motivation to keep working on it. Thanks you!

### Acknowledgments

A shout out to [@vueeez](https://github.com/vueeez) who just jumped on Twitter DMs, contributing on Twitter Authentication Strategy.
