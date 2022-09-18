![GitHub-Mark-Light](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/light-logo.png#gh-light-mode-only)
![GitHub-Mark-Dark ](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/dark-logo.png#gh-dark-mode-only)

<p align="center">
  <p align="center">
    <a href="https://stripe-stack.fly.dev">Live Demo</a>
    ·
    <a href="https://twitter.com/DEV_XO1">Twitter</a>
    <br/>
    An Open Source Remix template that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. SQLite version. Deploys to Fly.io
  </p>
</p>

## Features

This template has been built on top of [Barebones Stack](https://github.com/dev-xo/barebones-stack), including all its base features.

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

- Authentication Ready with [Remix-Auth](https://www.npmjs.com/package/remix-auth) and [Socials](https://www.npmjs.com/package/remix-auth-socials) + [Twitter](https://github.com/na2hiro/remix-auth-twitter) Strategies.
- [Stripe Subscriptions](https://stripe.com/) with Support for multiple plans, [Upgrade / Downgrade](https://stripe.com/docs/billing/subscriptions/change) and [Customer Portal.](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- Support for Javascript developers with continuous updates over time based on `remix.init`.

### We've got a 🐘 [PostgreSQL](https://github.com/dev-xo/stripe-postgres-stack) version also.

Would you like to change something? Fork it, change it and use `npx create-remix --template your/repo`!<br/>
Learn more about [Remix Stacks](https://remix.run/stacks).

## Quickstart

Initializing the template is pretty simple. Run the following commands into your console to get started:

```sh
# Initializes template in your workspace:
npx create-remix --template dev-xo/stripe-stack

# Starts dev server:
npm run dev
```

> Note: Cloning the repository instead of initializing it with the above commands, will result in a unapropiate erxperience. This template uses `remix.init` to configure itself and prepare your environment.

## Getting Started

The following section will be splitted into three quick threads: **Live Demo, Development and Production**.

### Live Demo

Template's Demo has been developed to be really simple to test, being able to show all its provided features. Here is a basic workflow you can follow:

1. Log in with your preferred Social Authenticator.
2. Select a Subscription Plan.
3. Fill Stripe Checkout inputs with default development values. _(Check note from bellow.)_
4. You should be redirected back to the App with selected Stripe Plan already set.

> Notes: Stripe Checkout default dev values: Type `4242` as much times as you can on each available input.

### Development

Understanding our development workspace will keep us productive.

### Folder Structure

Let's review some of template's important folders:

    ├── modules         # Groups our App logic and splits it into smaller sections.
      ├──                 Stores related Components, Database interactions, Sessions, Utils etc.
      ├──                 This folder could also be called "lib", "services" etc.

    ├── routes
      ├── api           # Stores Stripe Webhook Endpoint file, and any realted API calls.
      ├── resources     # Used to call our own Server, do Redirects, update Sessions and so on.

### Authentication Strategies

To provide Authentication to our App, we will need to get the API Keys from our Socials Providers.
Below here you can find all template's Providers OAuth Documentations.

- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth](https://developer.twitter.com/en/docs/authentication/overview)
- [Github OAuth](https://docs.github.com/es/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Discord OAuth](https://discord.com/developers/docs/topics/oauth2)

Once you've got the Providers API Keys, set them into template's `.env` file.

> If you are struggling on this step, feel free to contact me directly, have a look on youtube, or do a quick search on Google!.

### Stripe Webhook - Development

Let's see how we can start receiving Stripe Events to our Webhook Endpoint.

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Keep the following command running on the background:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

3. The provided `Webhook Signing Secret` from the above command, has to be set in our `.env` file as `DEV_STRIPE_WEBHOOK_ENDPOINT_SECRET`.

### Stripe Products

From [Stripe Products](https://dashboard.stripe.com/test/products) Dashboard, create as many products as you want. Remember to update their API Keys from `.env` file, as well as their descriptions from `/modules/stripe/stripe-plans`.

### Production

### Stripe Webhook - Production

Let's see how we can get and set our Production Webhook.

1. Visit [Webhooks](https://dashboard.stripe.com/test/webhooks) section from your Stripe Dashboard.
2. Create a new Webhook Endpoint.
3. Set your deployed App Webhook Endpoint URL into `Endpoint URL` input. _(Check notes.)_
4. Reveal the `Signing Secret` value that has been provided from Stripe Webhook page and set it as `PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET` in template's `.env` file.

> Notes: <br />
> The link provided to Webhooks section its from Stripe Test Mode. Feel free to complete the "Activate Payments" steps to get a production Webhook Key.<br />
> This is an example URL of a Deployed Webhook Endpoint: https://stripe-stack.fly.dev/api/webhook

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying our app to Production and Staging Environments.

Prior to the first deployment, we'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and Log in to Fly:

```sh
fly auth signup
```

- Create two apps on Fly, one for staging and one for production:

```sh
fly apps create stripe-stack
fly apps create stripe-stack-staging
```

> Make sure this name matches the `app` set into `fly.toml` file. Otherwise, you will not be able to deploy.

- Initialize Git:

```sh
git init
```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

```sh
git remote add origin <ORIGIN_URL>
```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

```sh
fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app stripe-stack
fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app stripe-stack-staging
```

> If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

```sh
fly volumes create data --size 1 --app stripe-stack
fly volumes create data --size 1 --app stripe-stack-staging
```

- Now that everything is set up you can **commit and push** your changes to your repo.

> Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### ▫️ Setting Up Production Envs

Here is a simple command we can use after deployment. Fill it with the required App `.env` variables.

```sh
flyctl secrets set NODE_ENV=production PROD_HOST_URL= GOOGLE_CLIENT_ID= GOOGLE_CLIENT_SECRET= GITHUB_CLIENT_ID= GITHUB_CLIENT_SECRET= TWITTER_CLIENT_ID= TWITTER_CLIENT_SECRET= DISCORD_CLIENT_ID= DISCORD_CLIENT_SECRET= STRIPE_PUBLIC_KEY= STRIPE_SECRET_KEY= PLAN_1_PRICE_ID= PLAN_2_PRICE_ID= PLAN_3_PRICE_ID= PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET=
```

> Development variables has opted out from this command.

### ▫️ Connecting to your database

The SQLite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment.<br/><br/>
Anything that gets into the `main` branch will be deployed to production after running tests / build / etc.<br/>
Anything in the `dev` branch will be deployed to staging.

## Testing

### Cypress

We use Cypress for End-to-End tests. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

Also feel free to update prettier settings from `.package-json` with your preferred configuration.

## Contributing

Contributions are Welcome! Jump in and help us improve this Community Template over time!

- [Contributing Guide](https://github.com/dev-xo/stripe-stack/blob/main/CONTRIBUTING.md) Docs.
- [Public Project Roadmap](https://github.com/users/dev-xo/projects/5) Check our TODOs, Fixes and Updates.

## Support

If you found the template useful, feel free to [Star ⭐ It](https://github.com/dev-xo/stripe-stack).
It helps the repository grow and gives me motivation to keep working on it. Thanks you!

### Acknowledgments

Big thanks to Kent C. Dodds _(Not gonna bother @him tagging, instead gonna leave here his [Website](https://kentcdodds.com/))_. Him has supported some of my work on Twitter a few times already, and that's something truly amazing for any small developer.

Also a big shout out to [@vueeez](https://github.com/vueeez) who just jumped on Twitter DMs, contributing on Twitter Authentication Strategy.
