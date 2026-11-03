# Welcome to Remix SaaS Deployment Documentation

If you are new to Fly.io, please check the [Getting Started](https://fly.io/docs/getting-started/) guide to have a better understanding of the platform.

> [!IMPORTANT]
> Read the [maintenance notes](../maintenance.md) before deployment, including the remaining upstream security findings. Use real credentials with `MOCK_SERVICES=false`; local mock mode is rejected in production. The initial migration is checked in. Back up and baseline an existing database before applying migrations.

## Stripe Webhook - Production

To get started, we'll require to get our Stripe Production Webhook API Key. This key will be required to set up the `STRIPE_WEBHOOK_ENDPOINT` variable in our `.env` file.

1. Visit the [Stripe Webhook](https://dashboard.stripe.com/test/webhooks) section.
2. Create a new Webhook Endpoint.
3. Set the name of your future deployed app as the Webhook URL input. _(Check Notes)_
4. Select the API version matching the installed Stripe SDK from `API version` selector.
5. Select the following events to listen on: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
6. Add the Endpoint and reveal the `Signing Secret` value that has been provided from Stripe Webhook page.
7. Set this new secret as `STRIPE_WEBHOOK_ENDPOINT` variable into your `.env` file.

> [!NOTE]
> Example of a Deployed Webhook Endpoint URL: https://deployed-app.fly.dev/api/webhook

Done! Now we can start receiving Stripe Events to your deployed app.

## Fly.io Deployment

Let's deploy our app!

1. [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)
2. Sign up or Log in into Fly:

```sh
fly auth signup
fly auth login
```

3. Launch your Fly app deployment:

```sh
fly launch
```

> [!NOTE]
> Everything is already set up for you, just follow the instructions provided by the CLI.
> Also, ensure that `template-name` from Fly CLI matches with the one from your `fly.toml` file.

4. After Fly CLI finishes the setup, we'll need to provide our `.env` variables as secrets. For that, fill in the following command with your environment variables:

```sh
fly secrets set SESSION_SECRET="" ENCRYPTION_SECRET="" PROD_HOST_URL="https://my-app.fly.dev" RESEND_API_KEY="" STRIPE_SECRET_KEY="" STRIPE_WEBHOOK_ENDPOINT="" HONEYPOT_ENCRYPTION_SEED=""
```

> [!NOTE]
> The `PROD_HOST_URL` variable, requires the full name of your app, including `https` and `.fly.dev` domain. Example: `https://my-app.fly.dev`.

Some `.env` variables, like `GITHUB_CLIENT_ID` has been skipped, in order to keep the deployment process as simple as possible.

5. Deploy after configuring real credentials. The entrypoint applies migrations and runs the repeatable seed. The local admin user is only seeded in mock mode; provision production administrators deliberately.

```sh
fly deploy
```

6. Done! Visit your app at `https://my-app.fly.dev` 🎉!

## Additional Notes

- The deployment can also be handled by a CI/CD pipeline, but it's not covered in this documentation.
- If you have made any changes and want to redeploy the app, you can run `fly deploy` in your console.

## Done! 🎉

That's it! You've successfully deployed your Remix SaaS application to Fly.io. If you have any questions or need help, feel free to open an issue as we'll be glad to help you out.

## Contributing

If you have any suggestions or improvements, feel free to open an Issue or a Pull Request. Your contribution will be more than welcome!

- [Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started)
- [Live Demo](https://remix-saas.fly.dev)
- [Twitter Updates](https://twitter.com/DanielKanem)
