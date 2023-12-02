![GitHub-Mark-Light](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Intro-Light.png#gh-light-mode-only)
![GitHub-Mark-Dark ](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Intro-Dark.png#gh-dark-mode-only)

<p align="center">
  <p align="center">
    <a href="https://stripe-stack-dev.fly.dev">Live Demo</a>
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

Template features are divided into two categories: **Base Features** and **Stack Features**.

### Base Features

- Database ORM with [Prisma.](https://www.prisma.io)
- Production Ready with [SQLite](https://sqlite.org/index.html) and [PostgreSQL.](https://www.postgresql.org)
- [Fly app Deployment](https://fly.io) with [Docker.](https://www.docker.com/products/docker-desktop)
- [GitHub Actions](https://github.com/features/actions) for Deploy on merge to Production and Staging environments.
- HealthCheck Endpoint for [Fly Backups.](https://fly.io/docs/reference/configuration/#services-http_checks)
- Styling with [TailwindCSS](https://tailwindcss.com) + [Tailwind Prettier-Plugin.](https://github.com/tailwindlabs/prettier-plugin-tailwindcss)
- End-to-End testing with [Playwright.](https://playwright.dev)
- Linting with [ESLint.](https://eslint.org)
- Code formatting with [Prettier.](https://prettier.io)
- Static Types with [TypeScript.](https://www.typescriptlang.org)
- Support for Javascript developers based on `remix.init`.

### Stack Features

- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview) with support for [Billing Cycles](https://stripe.com/docs/billing/subscriptions/billing-cycle), [Multi Currency](https://stripe.com/docs/currencies) and [Customer Portal.](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- Authentication Ready with [Remix-Auth](https://www.npmjs.com/package/remix-auth), [Remix Auth OTP](https://github.com/dev-xo/remix-auth-otp) and [Socials Strategies.](https://github.com/TheRealFlyingCoder/remix-auth-socials)
- Flat Routes with [Remix Flat Routes.](https://github.com/kiliman/remix-flat-routes)

Learn more about [Remix Stacks.](https://remix.run/stacks)

> Stripe Stack v3 has been released after the integration of Supa-Stripe-Stack from [rphlmr](https://github.com/rphlmr). Special thanks to him for his great work and a big recommendation to check his [implementation](https://github.com/rphlmr/supa-stripe-stack).

## Live Demo

We've created a simple demo that displays all template provided features. Feel free to test it [here](https://stripe-stack-dev.fly.dev).

[![Remix Auth OTP Stack](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/Thumbnail-Min.png)](https://stripe-stack-dev.fly.dev)

Here's a simple workflow you can follow to test the template:

1. Visit the [Live Demo](https://stripe-stack-dev.fly.dev).
2. Log in with your preferred authentication method.
3. Select a Subscription Plan and fill the Stripe Checkout inputs with its test values. _Check Notes._

> [!NOTE]
> Stripe test mode uses the following number: `4242` as valid values for Card Information.
> Type it as much times as you can on each available input to successfully complete the checkout step.

---

## Getting Started

Before starting our development or even deploying our template, we'll require to setup a few things.

## Template

Stripe Stack has support for multiple database choices based on Prisma. The installer will prompt a selector allowing you to choose the database your project will run on.

To get started, run the following commands in your console:

```sh
# Initialize template into your workspace:
npx create-remix@latest --template dev-xo/stripe-stack

# Select the database your project will run on:
> SQLite or PostgreSQL

# Done! 💿 Please, keep reading the documentation to Get Started.
```

> [!NOTE]
> Cloning the repository instead of initializing it with the above commands, will result in a inappropriate experience. Stripe Stack uses `remix.init` to configure itself and prepare your environment.

## Environment

We'll require a few environment variables to get our app up and running.

### Authentication Envs

Stripe Stack has support for [Email Code](https://github.com/dev-xo/remix-auth-otp) _(Includes Magic Link)_ and [Socials](https://github.com/TheRealFlyingCoder/remix-auth-socials) Authentication Strategies. Feel free to visit the links to learn more about each one and how to configure them.

### Stripe Envs

In order to use Stripe Subscriptions and seed our database, we'll require to get the secret keys from our Stripe Dashboard.

1. Create a [Stripe Account](https://dashboard.stripe.com/login) or use an existing one.
2. Visit [API Keys](https://dashboard.stripe.com/test/apikeys) section and copy the `Publishable` and `Secret` keys.
3. Paste each one of them into your `.env` file as `STRIPE_PUBLIC_KEY` and `STRIPE_SECRET_KEY` respectively.

### Stripe Webhook Envs

In order to start receiving Stripe Events to our Webhook Endpoint, we'll require to install the [Stripe CLI.](https://stripe.com/docs/stripe-cli) Once installed run the following command in your console:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

This should give you a Webhook Secret Key. Copy and paste it into your `.env` file as `DEV_STRIPE_WEBHOOK_ENDPOINT`.

> [!IMPORTANT]
> This command should be running in your console while developing.

## Database

Before starting our development, we'll require to setup our Prisma Migrations. First, ensure that your Prisma Schema is configured accordingly to your needs. Check `/prisma/schema.prisma` to learn more about it.

Once you're done, run the following command in your console:

```sh
npx prisma migrate dev --name init --skip-seed
```

### Seeding Database

Now that we have our database initialized, we'll require to seed it with our Stripe Plans. Check `/services/stripe/plans` to learn more about it.

Once you're done, run the following command in your console:

```sh
npx prisma db seed
```

> **Warning**
> You'll require to have your Stripe Envs already configured and no Stripe Products created with the same `id` as the ones in `/services/stripe/plans`.

## Development Server

Now that we have everything configured, we can start our development server. Run the following command in your console:

```sh
npm run dev
```

You should be able to access your app at 🎉 [http://localhost:3000](http://localhost:3000).

## Deployment

Stripe Stack has support for SQLite and PostgreSQL databases. In order to keep a better track and an easier maintenance of each deployment documentation, we moved each one to its own file.

Visit the [Deployment Docs](https://github.com/dev-xo/dev-xo/tree/main/stripe-stack/docs) in order to get your app to production.

## GitHub Actions

GitHub Actions are used for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests, build, etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Playwright

We use Playwright for our End-to-End tests. You'll find those in `tests/e2e` directory.
To run your tests in development use `npm run test:e2e:dev`.

### Type Checking

It's recommended to get TypeScript set up for your editor _(if your template uses it)_ to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project use `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.
To run linting across the whole project use `npm run lint`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting. It's recommended to install an editor plugin to get auto-formatting on save.
To run formatting across the whole project use `npm run format`.

This template has pre-configured prettier settings inside `.prettierrc`.
Feel free to update each value with your preferred work style and tun the above command to format your project.

## Support

If you find this template useful, support it with a [Star ⭐](https://github.com/dev-xo/stripe-stack)<br />
It helps the repository grow and gives me motivation to keep working on it. Thank you!

## License

Licensed under the [MIT License](https://github.com/dev-xo/stripe-stack/blob/main/LICENSE).
