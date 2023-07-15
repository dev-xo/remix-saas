"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureStripeCustomerPortal = void 0;
const config_server_1 = require("../../../services/stripe/config.server");
async function configureStripeCustomerPortal(products) {
    if (!products)
        throw new Error('Missing required parameters to configure Stripe Customer Portal.');
    return config_server_1.stripe.billingPortal.configurations.create({
        business_profile: {
            headline: 'Organization Name - Customer Portal',
        },
        features: {
            customer_update: {
                enabled: true,
                allowed_updates: ['address', 'shipping', 'tax_id', 'email'],
            },
            invoice_history: { enabled: true },
            payment_method_update: { enabled: true },
            subscription_pause: { enabled: false },
            subscription_cancel: { enabled: true },
            subscription_update: {
                enabled: true,
                default_allowed_updates: ['price'],
                proration_behavior: 'always_invoice',
                products: products.filter(({ product }) => product !== 'free'),
            },
        },
    });
}
exports.configureStripeCustomerPortal = configureStripeCustomerPortal;
