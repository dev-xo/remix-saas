# Authentication

This document will guide you through the Authentication process of Remix SaaS.

## How does Authentication work in Remix SaaS?

Remix SaaS provides a simple and secure way to authenticate your users with the following methods:

- Email/Code
- Magic Links
- Social Logins (Github)

Under the hood, we are using `remix-auth`, `remix-auth-totp` and `remix-auth-github` to handle the authentication process.

In order to speed up development, the OTP code will also be displayed in the terminal/console, so you don't have to constantly check the email inbox. (Recommended for development purposes only.)

- You can update/remove this behavior by removing the `console.log()` from `/modules/auth/auth.server.ts` file.

## Email/Code & Magic Links

Email authentication, either by code or magic links, is a common way to authenticate users in web applications. Remix SaaS provides a simple way to authenticate users with their email address.

We are using `remix-auth-totp` and [Resend](https://resend.com) to handle email authentication.

- You can get your API Key by visiting the [Resend Dashboard](https://resend.com/api-keys).

## Social Logins (Github)

Social Logins are a great way to authenticate users in web applications. Remix SaaS provides a simple way to authenticate users with their Github account. We are using `remix-auth-github` to handle the authentication process.

You can create a new Github App or OAuth App by visiting [Github Developer Settings](https://github.com/settings/developers) in order to get your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` API Keys.

> [!NOTE]
> In most cases you just want to create a Github App instead of an OAuth app.

The details you'll want to provide for each Github App (or OAuth App) are:

- Home Page URL: `http://localhost:3000/`
- Callback URL: `http://localhost:3000/auth/github/callback`

Once created:

- For Github Apps:
  - Expand `Account Permissions` section
    - Change `Email addresses` to `Read only`
  - Ensure that `Optional Features > User-to-Server token expiration` button is labeled `Opt-out`
- Copy the `Client ID` and put it in your `.env` under `GITHUB_CLIENT_ID`
- Click `Generate new client secret`, copy the secret and put it in your `.env` under `GITHUB_CLIENT_SECRET`

> [!NOTE]
> It is preferable to create a separate Github App for each deployed environment; for example:
>
> `Local Development`
>
> ```
> Name: [LOCAL] Your App Name
> Home Page URL: `http://localhost:3000/`
> Callback URL: `http://localhost:3000/auth/github/callback`
> ```
>
> `Production`
>
> ```
> Name: Your App Name
> Home Page URL: `https://myappna.me/`
> Callback URL: `https://myappna.me/auth/github/callback`
> ```

### Authenticate as Admin

You can authenticate as `admin` by using the following credentials:

- Email: `admin@admin.com`
- Code: OTP Code is provided by the terminal/console, as email is not sent to the `admin` user.

The default admin email can be changed in the `/prisma/seed.ts` file.

## Learn More

If you want to learn more about `remix-auth-totp` and `remix-auth-github`, please visit the following links:

- [Remix Auth TOTP](https://github.com/dev-xo/remix-auth-totp): A Time-Based One-Time Password (TOTP) Authentication Strategy for Remix-Auth.
- [Remix Auth Github](https://github.com/sergiodxa/remix-auth-github): A GitHubStrategy for Remix Auth, based on the OAuth2Strategy.

## Contributing

If you have any suggestions or improvements, feel free to open an Issue or a Pull Request. Your contribution will be more than welcome!

- [Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started)
- [Live Demo](https://remix-saas.fly.dev)
- [Twitter Updates](https://twitter.com/DanielKanem)
