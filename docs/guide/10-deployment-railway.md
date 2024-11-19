# Welcome to Remix SaaS Deployment Documentation

If you are new to [Railway](https://railway.com), please check the [Getting Started](https://docs.railway.com/quick-start) guide to have a better understanding of the platform.

> [!IMPORTANT]
> Your Prisma Migrations will be required in order to deploy the app. Also, Stripe Test Data should be cleaned (Only for development purposes).

## Stripe Webhook - Production

To get started, we'll require to get our Stripe Production Webhook API Key. This key will be required to set up the `STRIPE_WEBHOOK_ENDPOINT` variable in our `.env` file.

1. Visit the [Stripe Webhook](https://dashboard.stripe.com/test/webhooks) section.
2. Create a new Webhook Endpoint.
3. Set the name of your future deployed app as the Webhook URL input. _(Check Notes)_
4. Select the latest Stripe API version from `API version` selector.
5. Select the following events to listen on: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`.
6. Add the Endpoint and reveal the `Signing Secret` value that has been provided from Stripe Webhook page.
7. Set this new secret as `STRIPE_WEBHOOK_ENDPOINT` variable into your `.env` file.

> [!NOTE]
> Example of a Deployed Webhook Endpoint URL: https://deployed-app.fly.dev/api/webhook

Done! Now we can start receiving Stripe Events to your deployed app.

## Railway Deployment

Let's deploy our app!

The fastest option to be up and running on Railway is to use the button below to deploy the Remix Saas stack in one-click!

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/Bw4Gck)

[Eject from the template after deployment](https://docs.railway.com/guides/deploy#eject-from-template-repository) to create a copy of the repo on your GitHub account.


### Deploy from the CLI

1. **Install the Railway CLI**:
    - <a href="/guides/cli#installing-the-cli" target="_blank">Install the CLI</a> and <a href="/guides/cli#authenticating-with-the-cli" target="_blank">authenticate it</a> using your Railway account.
2. **Initialize a Railway Project**:
    - Run the command below in your Remix saas app directory. 
        ```bash
        railway init
        ```
    - Follow the prompts to name your project.
    - After the project is created, click the provided link to view it in your browser.
3. **Add a Postgres Database Service**:
    - Run `railway add -d postgres`.
    - Hit **Enter** to add it to your project.
    - A database service will be added to your Railway project.
4. **Add a Service and Environment Variable**:
    - Run `railway add`.
    - Select `Empty Service` from the list of options.
    - In the `Enter a service name` prompt, enter `app-service`.
    - In the `Enter a variable` prompt, enter `DATABASE_URL=${{Postgres.DATABASE_URL}}`. 
        - The value, `${{Postgres.DATABASE_URL}}`, references the URL of your new Postgres database. 
        - Set values for `ENCRYPTION_SECRET`, `SESSION_SECRET`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, and `STRIPE_WEBHOOK_ENDPOINT`.
5. **Deploy the Application**:
    - Run `railway up` to deploy your app.
        - This command will scan, compress and upload your app's files to Railway. You’ll see real-time deployment logs in your terminal.
    - Once the deployment is complete, we can proceed to generate a domain for the app service.
6. **Set Up a Public URL**:
    - Run `railway domain` to generate a public URL for your app.
    - Visit the new URL to see your app live in action!


## Additional Notes

- The deployment can also be handled by a CI/CD pipeline, but it's not covered in this documentation.
- If you have made any changes and want to redeploy the app, you can run `railway up` in your console.

## Done! 🎉

That's it! You've successfully deployed your Remix SaaS application to [Railway](https://railway.com). If you have any questions or need help, feel free to open an issue as we'll be glad to help you out.

## Contributing

If you have any suggestions or improvements, feel free to open an Issue or a Pull Request. Your contribution will be more than welcome!

- [Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started)
- [Live Demo](https://remix-saas-production.up.railway.app)
- [Twitter Updates](https://twitter.com/DanielKanem)
