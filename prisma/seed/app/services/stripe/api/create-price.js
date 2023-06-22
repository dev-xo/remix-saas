"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripePrice = void 0;
const config_server_1 = require("../../../services/stripe/config.server");
async function createStripePrice(id, price, params) {
    var _a, _b, _c;
    if (!id || !price)
        throw new Error('Missing required parameters to create Stripe Price.');
    return config_server_1.stripe.prices.create({
        ...params,
        product: id,
        currency: (_a = price.currency) !== null && _a !== void 0 ? _a : 'usd',
        unit_amount: (_b = price.amount) !== null && _b !== void 0 ? _b : 0,
        tax_behavior: 'inclusive',
        recurring: {
            interval: (_c = price.interval) !== null && _c !== void 0 ? _c : 'month',
        },
    });
}
exports.createStripePrice = createStripePrice;
