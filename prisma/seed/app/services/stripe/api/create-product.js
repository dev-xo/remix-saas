"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStripeProduct = void 0;
const config_server_1 = require("../../../services/stripe/config.server");
async function createStripeProduct(product, params) {
    if (!product || !product.id || !product.name)
        throw new Error('Missing required parameters to create Stripe Product.');
    return config_server_1.stripe.products.create({
        ...params,
        id: product.id,
        name: product.name,
        description: product.description || undefined,
    });
}
exports.createStripeProduct = createStripeProduct;
