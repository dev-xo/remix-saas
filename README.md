![GitHub-Mark-Light](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/sqlite-white-logo-v2.png#gh-light-mode-only)
![GitHub-Mark-Dark ](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/sqlite-dark-logo-v2.png#gh-dark-mode-only)

<p align="center">
  <p align="center">
    <a href="https://stripe-stack.fly.dev">Live Demo</a>
    ·
    <a href="https://github.com/dev-xo/dev-xo/blob/main/stripe-stack/docs/SQLITE-DEPLOYMENT.md">Deployment Documentation</a>
    ·
    <a href="https://twitter.com/DanielKanem">Twitter</a>
    <br/>
    <br/>
    An open source Remix Template that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. Javascript Supported. SQLite version. Deploys to Fly.io 
  </p>
</p>

## Features

Stripe Stack has been built on top of [Barebones SQLite Stack](https://github.com/dev-xo/barebones-stack), including all its base features.

### Base Features

- [Fly app Deployment](https://fly.io) with [Docker.](https://www.docker.com/products/docker-desktop/)
- Database ORM with [Prisma.](https://www.prisma.io/)
- Production Ready with [SQLite Database.](https://sqlite.org/index.html)
- [GitHub Actions](https://github.com/features/actions) for Deploy on merge to Production and Staging environments.
- Healthcheck Endpoint for [Fly backups Region Fallbacks.](https://fly.io/docs/reference/configuration/#services-http_checks)
- Styling with [Tailwind.css](https://tailwindcss.com/) + [Tailwind Prettier-Plugin.](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- End-to-End testing with [Cypress.](https://www.cypress.io/how-it-works)
- Unit Testing with [Vitest](https://vitest.dev) and [Testing Library.](https://testing-library.com)
- Local third party request mocking with [MSW.](https://mswjs.io)
- Linting with [ESLint.](https://eslint.org/)
- Code formatting with [Prettier.](https://prettier.io/)
- Static Types with [TypeScript.](https://www.typescriptlang.org/)

### Implemented Features

- Authentication Ready with [Remix-Auth](https://www.npmjs.com/package/remix-auth) that includes [Socials Strategies](https://www.npmjs.com/package/remix-auth-socials) + [Twitter Strategy.](https://github.com/na2hiro/remix-auth-twitter)
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview) with support for Multiple Plans, [Upgrade / Downgrade](https://stripe.com/docs/billing/subscriptions/change) and [Customer Portal.](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- Support for Javascript developers with continuous updates over time based on `remix.init`.

### We've got a 🐘 [PostgreSQL](https://github.com/dev-xo/stripe-postgres-stack) version also.

Learn more about [Remix Stacks](https://remix.run/stacks).

## Quickstart

To get started, run the following commands in your console:

```sh
# Initializes template in your workspace:
npx create-remix@latest --template dev-xo/stripe-stack

# Starts dev server:
npm run dev
```

> Notes: Cloning the repository instead of initializing it with the above commands, will result in a inappropriate experience. This template uses `remix.init` to configure itself and prepare your environment.

## Getting Started

The following section will be splitted into three quick threads: **Live Demo**, **Development** and **Production**.

### Live Demo

Template's Demo has been built to be really simple to test, being able to show all its provided features. Here is a basic workflow we can follow to test it:

1. Log in with your preferred Social Authenticator.
2. Select a Subscription Plan.
3. Fill Stripe Checkout inputs with default development values. _(Check Notes)_
4. We should be redirected back to the app with selected Stripe Plan already set.

> Notes: Stripe test mode uses the following number: `4242` as valid values for Card Information. Type it as much times as you can on each available input to successfully complete Checkout step.

### Development

Understanding our development workspace will keep us productive.

### Usage

Template can be used in the way you like. Feel free to remove all the HTML code you don't need, and keep just the `actions and loaders` from Remix.

Code that is necessary for the template to keep working as expected, has been marked as `@required`.

### Folder Structure

Let's review some of template's important folders:

    ├── modules         # Groups app logic and splits it into smaller sections.
      ├──                 Stores related components, database interactions, configs, utils etc.
      ├──                 This folder could also be called "lib" or "services".

    ├── routes
      ├── api           # Stores Stripe Webhook Endpoint file, and any realted API calls.
      ├── resources     # Stores database calls, redirects, session updates and so on.

### Authentication Strategies

To provide authentication to our app, we will need to get the secret API Keys from our Socials Providers.
Below here you can find all template's Providers OAuth Documentations.

- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth](https://developer.twitter.com/en/docs/authentication/overview)
- [Github OAuth](https://docs.github.com/es/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Discord OAuth](https://discord.com/developers/docs/topics/oauth2)

Usually this providers will ask you for a `Callback URI / Redirect URL`.

An example of a Callback URI would look like this one: `https://my-deployed-app.fly/auth/provider/callback`. Replace `/provider` with the one you are trying to setup. Available providers are: `google`, `twitter`, `github` and `discord`.

Once you've got the Providers API Keys, set them into template's `.env` file.

> If you are struggling on this step, feel free to contact me directly, have a look on youtube, or do a quick search on Google.

### Stripe Webhook - Development

Let's see how we can start receiving Stripe Events to our Webhook Endpoint.

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Keep the following command running on the background:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

3. The provided `Webhook Signing Secret` from the above command, has to be set in our `.env` file as `DEV_STRIPE_WEBHOOK_ENDPOINT_SECRET`.

### Stripe Products

From [Stripe Products](https://dashboard.stripe.com/test/products) Dashboard, create as many products as you want. Remember to update their secret Keys from `.env` file, as well as their descriptions from `/modules/stripe/stripe-plans`.

### Production

### Stripe Webhook - Production

Let's see how we can get and set our Production Webhook.

1. Visit [Webhooks](https://dashboard.stripe.com/test/webhooks) section from your Stripe Dashboard.
2. Create a new Webhook Endpoint.
3. Set your deployed app Webhook Endpoint URL into `Endpoint URL` input. _(Check Notes)_
4. Reveal the `Signing Secret` value that has been provided from Stripe Webhook page and set it as `PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET` in template's `.env` file.

> Notes: This is an example of a Deployed Webhook Endpoint URL: https://stripe-stack.fly.dev/api/webhook

## Deployment

Stripe Stack it's composed of two templates variants: SQLite and PostgreSQL. In order to keep a better track and an easier maintenance of each repository documentation, deployment section has been moved to its own file.

Check [SQLite DEPLOYMENT.md](https://github.com/dev-xo/dev-xo/blob/main/stripe-stack/docs/SQLITE-DEPLOYMENT.md) to get your app to production.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment.<br/><br/>
Anything that gets into the `main` branch will be deployed to production after running tests, build, etc.<br/>
Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for End-to-End tests. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

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

- [Contributing Guide](https://github.com/dev-xo/stripe-stack/blob/main/CONTRIBUTING.md) Docs.
- [Public Project Roadmap](https://github.com/users/dev-xo/projects/5) Check template's TODOs, fixes and updates.

## Support

If you found the template useful, support it with a [Star ⭐](https://github.com/dev-xo/stripe-stack)<br />
It helps the repository grow and gives me motivation to keep working on it. Thanks you!

### Acknowledgments

Big thanks to Kent C. Dodds _(Not gonna bother @him tagging, instead gonna leave here his [Website](https://kentcdodds.com/))_. Him has supported some of my work on Twitter a few times already, and that's something truly amazing for any small developer.

Also a big shout out to [@vueeez](https://github.com/vueeez) who just jumped on Twitter DMs, contributing on Twitter Authentication Strategy.
