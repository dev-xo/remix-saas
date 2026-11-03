# Welcome to 🛍️ Remix SaaS Documentation

The goal of Remix SaaS is to provide a lightweight, feature-rich, and production-ready Remix Stack for your next SaaS application.

> [!NOTE]
> Documentation will be updated and improved as the project progresses. If you have any questions or suggestions, feel free to open an Issue or Pull Request as we'll be more than happy to help you.

# List of Contents

- [Live Demo](https://remix-saas.fly.dev) - Give it a few seconds to load, it's running on a free tier! :)
- [Introduction](./guide/01-introduction.md) - Simple introduction to Remix SaaS (Recommended Read).
- [Getting Started](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started) - Quick Start guide to get Remix SaaS up and running.
- [Deployment](./guide/09-deployment.md) - Step-by-step guide on how to deploy your Remix SaaS App
  to production.

Please, check the [Guide](./guide) docs in order to learn more about Remix SaaS.

# Features

A list of features that Remix SaaS provides out of the box:

- ⚡ **Vite**: Next-Gen Frontend Tooling.
- 🧩 **Prisma ORM**: Modern Database Toolkit.
- 🛍️ **Stripe**: Subscription Plans, Customer Portal, and more.
- 🔑 **Authentication**: Email Code, Magic Link and Social Logins.
- 🎨 **TailwindCSS**: Utility-First CSS Framework.
- 📐 **ShadCN**: Composable React components.
- 🌙 **Easy Theming**: Switch between Light and Dark modes with ease.
- 🗺️ **Remix Flat Routes**: Simple Route Definitions.
- 🍞 **Client & Server Toasts**: Display Toasts on your App.
- 🛡️ **Server Rate Limiting**: Extra layer of Protection for your App.
- 🕵️‍♂️ **CSRF and Honeypot Protection**: Prevent Malicious Attacks.
- 📧 **Resend**: Email for Developers.
- 💌 **React Email**: Customizable Emails with React.
- 📋 **Conform**: Type-Safe Form Validation based on Web Fundamentals.
- 📥 **File Uploads**: Profile Picture Uploads with Prisma.
- 🌐 **I18N**: Internationalization for your App.
- ⚙️ **Github Actions**: Automate CI/CD Workflows.

We've been looking into keeping Remix SaaS as simple as possible, while providing a solid foundation for your next SaaS project.

Some other "non-technical" features include:

- 💅 **Modern UI**: Carefully crafted UI with a Modern Design System.
- 🏕 **Custom Pages**: Landing, Onboarding, Dashboard and Admin Pages.
- 📱 **Responsive**: Works on all devices, from Mobile to Desktop.

## [Live Demo](https://remix-saas.fly.dev)

[![Remix SaaS](https://raw.githubusercontent.com/dev-xo/dev-xo/main/remix-saas/intro.png)](https://remix-saas.fly.dev)

We've created a simple demo that displays all template provided features. Psst! Give the site a few seconds to load! _(It's running on a free tier!)_

Here's a simple workflow you can follow to test the template:

1. Visit the [Live Demo](https://remix-saas.fly.dev).
2. Log In with your preferred authentication method.
3. Select a Subscription Plan and fill the Stripe Checkout inputs with its test values.

> [!NOTE]
> Stripe Test Mode uses the following number: `4242` as valid values for Card Information.
> Type it as much times as you can on each available input to successfully complete the Checkout step.

# Getting Started

Before starting our development or even deploying our template, we'll require to setup a few things _(not many, I promise!)_ in order to have a smooth experience.

# Initialization

To get started, you can initialize the template into your workspace by running the following command:

```sh
npx create-remix-saas@latest

# Done! 🎉 Please, continue reading the documentation!
```

# Local setup

Use Node 24 LTS and npm. From a clone, run:

```sh
npm ci
npm run setup
npm run dev
```

Setup creates `.env` with random secrets, initializes SQLite, and seeds roles, a local admin, and demo plans. It preserves an existing `.env` and can be run again without duplicating records. No Stripe, Resend, or OAuth credentials are needed with `MOCK_SERVICES=true`.

Open [localhost:3000](http://localhost:3000), enter an email, and use the code or magic link from your server terminal. The local admin email is `admin@admin.com`. Email delivery and subscription upgrades are simulated locally. GitHub login is available when configured; Google is not implemented.

For real integrations, disable mock mode and configure the credentials described in the [maintenance notes](./maintenance.md). Production rejects mock mode. `npm run setup` is a local convenience; use checked-in migrations for deployment.

## Learn More

Please, make sure to check the rest of the documentation and learn more about Remix SaaS, its features and how to use them. A good starting point is the [Authentication](./guide/02-authentication.md) section, as it covers all the authentication methods, how to authenticate as admin, and more.

# Deployment

Deployment and some other docs are available in the [Deployment](./guide/09-deployment.md) section.

# Support

If you found **Remix SaaS** helpful, consider supporting it with a ⭐ [Star](https://github.com/dev-xo/remix-saas). It helps the repository grow and provides the required motivation to continue maintaining the project. Thank you!

## Sponsors

Huge thanks to our sponsors who makes it possible to maintain and improve Remix SaaS! 🙌

<table width="100%">
  <tr height="187px">
     <td align="center" width="50%">
      <a href="https://www.convex.dev/?utm_source=remix-saas-github" target="_blank">
      <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://static.convex.dev/logo/convex-logo-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://static.convex.dev/logo/convex-logo.svg">
        <img alt="Convex" src="https://static-http.s3.amazonaws.com/logo/convex-logo.svg">
      </picture>
      </a>
    </td>
    <td align="center" width="50%">
      <a href="mailto:devxo@mail.com">
        Support us!<br />💝
      </a>
    </td>
  </tr>
</table>
