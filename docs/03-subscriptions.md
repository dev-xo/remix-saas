# Subscriptions

Remix SaaS comes with a simple Subscription System built with Stripe. It includes the following features:

- Subscription Plans
- Subscription Checkout
- Subscription Management (via Stripe Customer Portal)
- Subscription Webhooks

## How does Subscriptions work in Remix SaaS?

First of all, you'll need to create a Stripe Account and get your API Keys. This has been documented in the [Environment](https://github.com/dev-xo/remix-saas/tree/main/docs#environment) section.

Remix SaaS defines a few Subscription Plans in the `/modules/stripe/plans` file. You can customize these plans to fit your needs.

- Remember to migrate/seed your database to update the plans or any other changes you've made.

In order to use the Subscription System, Remix SaaS will create a Customer in Stripe and subscribe it to a Free Plan by default.

- Customers are created after the Onboarding process is completed.

Free Plans are also canceled by default once the Customer has decided to upgrade to a Paid Plan.

## FAQs

Some frequently asked questions about Subscriptions.

## Can I test Subscriptions in Remix SaaS?

Yes, you can test Subscriptions in Remix SaaS by using the following Stripe Test Cards:

- `4242 4242 4242 4242` (Visa)
- `5555 5555 5555 4444` (Mastercard)

Remember that in order to test Subscriptions and handle events, you'll need to use the [Stripe CLI.](https://stripe.com/docs/stripe-cli) by running the following command:

```sh
stripe listen --forward-to localhost:3000/api/webhook
```

## Can I customize Subscriptions in Remix SaaS?

Yes, you can customize Subscriptions in Remix SaaS by editing the following files:

- `/modules/stripe/plans`: Define your Subscription Plans.

> [!NOTE]
> Any changes made to the Subscription Plans will require you to migrate/seed your database in order to update the plans. That also includes "Deleting Stripe Test Data" and "Re-Seeding the Database".

## Can we use another Payment Provider instead of Stripe?

Sadly no, although Remix SaaS is built to be flexible, it's currently only compatible with Stripe.

- There are plans to add more Payment Providers in the future, like [Lemon Squeezy](https://www.lemonsqueezy.com/), or [Paddle](https://www.paddle.com/).

## Contributing

If you have any suggestions or improvements, feel free to open an Issue or a Pull Request. Your contribution will be more than welcome!

- [Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started)
- [Live Demo](https://remix-saas.fly.dev)
- [Twitter Updates](https://twitter.com/DanielKanem)
