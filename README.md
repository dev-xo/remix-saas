![GitHub-Mark-Light](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/light-logo.png#gh-light-mode-only)
![GitHub-Mark-Dark ](https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/dark-logo.png#gh-dark-mode-only)

<p align="center">
  <p align="center">
    <a href="https://stripe-stack.fly.dev">Live Demo</a>
    ·
    <a href="https://twitter.com/DEV_XO2">Twitter</a>
    <br/>
    An open source Remix Stack that integrates Stripe Subscriptions, Social Authentication, Testing and a few more features. SQLite version. Deploys to Fly.io
  </p>
</p>

## 💿 Features

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

### Special Stack Features

- Authentication Ready with [Remix-Auth](https://www.npmjs.com/package/remix-auth) and [Socials](https://www.npmjs.com/package/remix-auth-socials) + [Twitter](https://github.com/na2hiro/remix-auth-twitter) Strategies.
- [Stripe Subscriptions](https://stripe.com/) with Support for multiple plans, [Upgrade / Downgrade](https://stripe.com/docs/billing/subscriptions/change) and [Customer Portal.](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)
- Support for Javascript developers with continuous updates over time based on `remix.init`.

### We've got a 🐘 [PostgreSQL](https://github.com/dev-xo/stripe-postgres-stack) version also.

Would you like to change something? Fork it, change it and use `npx create-remix --template your/repo`!<br/>
Learn more about [Remix Stacks](https://remix.run/stacks).

## ✨ Quickstart

```sh
# Initialize the following template in your workspace:
npx create-remix --template dev-xo/stripe-stack

# Start dev server:
npm run dev
```

Done! This starts your app in development mode, rebuilding assets on file changes.

## 👋 Getting Started

This section will be splitted in three threads: **Live Demo | Development | Production**.

### Live Demo

Template's Demo has been developed to be really simple to use, being able to show all its provided features. Let's see the workflow to test it:

- Log In with your preferred Social.

  > Feel free to remove the authorized App after testing it.

- Select a Subscription Plan.

  > Besides you will see real money values from Stripe Checkout, don't worry, it's absolutely safe.

- Fill Stripe Checkout inputs with default development values.

  > Type `4242` as much times as you can on each available Input.

- Done! We should be redirected back to our App with newly Plan already set.
  <br />

### Development

Understanding our development workspace will keep us productive.

### ▫️ Folder Structure

A solid folder structure will help our App grow healthy over time. Let's review the most important folders.

    ├── modules         # Groups our App logic and splits it into smaller sections.
      ├──                 Stores related Components, Database interactions, Sessions, Utils etc.
      ├──                 This folder could also be called "lib", "services" etc.

    ├── routes
      ├── api           # Stores Stripe Webhook Endpoint file, and any realted API calls.
      ├── resources     # Used to call our own Server, do Redirects, update Sessions and so on.

### ▫️ Authentication Strategies

To provide Authentication to our App, we will need to get the API Keys from our Socials Providers.
Below here you can find all template's Providers OAuth Documentations.

- [Google OAuth](https://developers.google.com/identity/protocols/oauth2)
- [Twitter OAuth](https://developer.twitter.com/en/docs/authentication/overview)
- [Github OAuth](https://docs.github.com/es/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [Discord OAuth](https://discord.com/developers/docs/topics/oauth2)

Once we got our Providers Keys `CLIENT and SECRET`, we can set them into `.env` file.

> If you are struggling on this step, feel free to contact me directly, have a look on youtube, or do a quick search on Google!.

### ▫️ Stripe Webhook

Let's see how we can start receiving Stripe Events to our Webhook Endpoint.

- Install [Stripe CLI](https://stripe.com/docs/stripe-cli)

- Run the following command on the background:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

The provided `Webhook Signing Secret` has to be set in our `.env` file as `DEV_STRIPE_WEBHOOK_ENDPOINT_SECRET`.

### ▫️ Stripe Products

From [Stripe Products](https://dashboard.stripe.com/test/products) Dashboard, create as many products as you want. Remember to update their API Keys from `.env` file, as well as their descriptions and names from `/modules/stripe/utils/stripe-plans`.

### Production

### ▫️ Stripe Webhook - Web Dashboard

Let's see how we can get and set our Production Webhook.

- Visit [Webhooks](https://dashboard.stripe.com/test/webhooks) Section into your Stripe Dashboard.

> The link provided to Webhooks its from Stripe Test Mode. Feel free to complete the "Activate Payments" steps to get a production Webhook Key.

- Create a new Webhook Endpoint.

- Set your deployed App Webhook Endpoint URL into `Endpoint URL` input.

> For this template was: https://stripe-stack.fly.dev/api/webhook

- Reveal the `Signing secret` that has been provided on your newly Webhook page and set it as `PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET` in our `.env` file.

> Done! Give it a try. If something went wrong, verify that the provided steps has been followed correctly.

## 🚀 Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly:

```sh
fly auth signup
```

- Create two apps on Fly, one for staging and one for production:

```sh
fly apps create stripe-stack
fly apps create stripe-stack-staging
```

> Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

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

Here is a simple command we can use after deployment. Feel free to fill it with your App `.env` variables.

```sh
flyctl secrets set NODE_ENV=production PROD_HOST_URL= GOOGLE_CLIENT_ID= GOOGLE_CLIENT_SECRET= GITHUB_CLIENT_ID= GITHUB_CLIENT_SECRET= TWITTER_CLIENT_ID= TWITTER_CLIENT_SECRET= DISCORD_CLIENT_ID= DISCORD_CLIENT_SECRET= STRIPE_PUBLIC_KEY= STRIPE_SECRET_KEY= PLAN_1_PRICE_ID= PLAN_2_PRICE_ID= PLAN_3_PRICE_ID= PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET=
```

> Development variables has opted out from this command.

### ▫️ Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

## ⚙️ GitHub Actions

We use GitHub Actions for continuous integration and deployment.<br/><br/>
Anything that gets into the `main` branch will be deployed to production after running tests / build / etc.<br/>
Anything in the `dev` branch will be deployed to staging.

## 💅 Testing

### ▫️ Cypress

We use Cypress for End-to-End tests. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

### ▫️ Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### ▫️ Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### ▫️ Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### ▫️ Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.

Also feel free to update prettier settings from `.package-json` with your preferred configuration.

## 🤝 Contributing

Contributions are Welcome! Jump in and help us improve this Community Template over time!

- [Contributing Guide](https://github.com/dev-xo/stripe-stack/blob/main/CONTRIBUTING.md) Docs.
- [Open Project Roadmap](https://github.com/users/dev-xo/projects/5) Check template TODOs, fixes and updates.

## 🍪 Support

If you found the project useful, help it by [Staring ⭐ It](https://github.com/dev-xo/stripe-stack)!
It helps the repository grow and gives me motivation to keep working on it. Thanks you!

### ▫️ Acknowledgments

All my respect and gratitude for Kent C. Dodds _(Not gonna @him, don't wanna bother, instead gonna leave here his [Website Blog](https://kentcdodds.com/))_. Has been supporting my work on Twitter a few times already, and that's something truly amazing for any small developer.

Also a big shout out to [@vueeez](https://github.com/vueeez) who just jumped on Twitter DMs, contributing on Twitter Authentication Strategy.
