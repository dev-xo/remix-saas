<h1 align="center">
  🛍️ Remix SaaS
</h1>

<div align="center">
  <p>
  A Lightweight, Feature-Rich, and Production-Ready Remix Stack for your next SaaS application.
  </p>
</div>

<div align="center">
  <p>
    <a href="https://remix-saas.fly.dev">Live Demo</a>
    ·
    <a href="https://github.com/dev-xo/remix-saas/tree/main/docs">Documentation</a>
    ·
    <a href="https://twitter.com/DanielKanem">Twitter</a>
  </p>
</div>

```sh
npx create-remix-saas@latest
```

## [Live Demo](https://remix-saas.fly.dev)

[![Remix SaaS](https://raw.githubusercontent.com/dev-xo/dev-xo/main/remix-saas/intro.png)](https://remix-saas.fly.dev)

We've created a simple demo that displays all template-provided features. Psst! Give the site a few seconds to load! _(It's running on a free tier!)_

> [!NOTE]
> Remix SaaS is an Open Source Template that shares common bits of code with: [Indie Stack](https://github.com/remix-run/indie-stack), [Epic Stack](https://github.com/epicweb-dev/epic-stack), [Cloudflare React Router SaaS](https://github.com/mw10013/cloudflare-react-router-saas), and some other amazing Open Source resources. Check them out, please!

## Getting Started

Use Node 24 LTS (see `.nvmrc`) and npm:

```sh
npm ci
npm run setup
npm run dev
```

Open [localhost:3000](http://localhost:3000). Setup creates an ignored `.env` with random secrets, a local SQLite database, roles, and demo plans. No external credentials are needed. Log in with any email address and use the code or magic link printed in the server terminal. For the local admin account, use `admin@admin.com`.

`MOCK_SERVICES=true` keeps email and billing local; mock mode is rejected in production. GitHub login appears only when its credentials are configured. Google login is not part of this template.

Run `npm run check` and then `npm run test:smoke` to verify the app. See [maintenance notes](docs/maintenance.md) for compatibility choices, known upstream security findings, and production setup.

Please, read the [Getting Started Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#remix-saas-documentation) to successfully initialize your **Remix SaaS** Template.

## Acknowledgments

Special thanks to [@mw10013](https://github.com/mw10013) who has been part of the Remix SaaS development.

If you found **Remix SaaS** helpful, consider supporting it with a ⭐ [Star](https://github.com/dev-xo/remix-saas). It helps the repository grow and provides the required motivation to continue maintaining the project. Thank you!

## Sponsors

Huge thanks to our sponsors who makes it possible to maintain and improve Remix SaaS! 🙌

<table width="100%">
  <tr height="187px">
    <td align="center" width="33%">
      <a href="https://launch.arcjet.com/hdXzPbO" target="_blank">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://arcjet.com/logo/arcjet-dark-lockup-voyage-horizontal.svg">
          <img src="https://arcjet.com/logo/arcjet-light-lockup-voyage-horizontal.svg" alt="Arcjet">
        </picture>
      </a>
    </td>
     <td align="center" width="33%">
      <a href="https://www.convex.dev/?utm_source=remix-saas-github" target="_blank">
        <picture>
          <source media="(prefers-color-scheme: dark)" srcset="https://static.convex.dev/logo/convex-logo-light.svg">
          <source media="(prefers-color-scheme: light)" srcset="https://static.convex.dev/logo/convex-logo.svg">
          <img alt="Convex" src="https://static-http.s3.amazonaws.com/logo/convex-logo.svg">
        </picture>
      </a>
    </td>
    <td align="center" width="33%">
      <a href="mailto:devxo@mail.com">
        Support us!<br />💝
      </a>
    </td>
  </tr>
</table>
