"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const db_1 = require("../app/utils/db");
const get_plan_1 = require("../app/models/plan/get-plan");
const plans_1 = require("../app/services/stripe/plans");
const create_product_1 = require("../app/services/stripe/api/create-product");
const create_price_1 = require("../app/services/stripe/api/create-price");
const configure_customer_portal_1 = require("../app/services/stripe/api/configure-customer-portal");
const prisma = new client_1.PrismaClient();
async function seed() {
    const plans = await (0, get_plan_1.getAllPlans)();
    if (plans.length > 0) {
        console.log('🎉 Plans has already been seeded.');
        return true;
    }
    const seedProducts = Object.values(plans_1.PRICING_PLANS).map(async ({ id, name, description, features, limits, prices }) => {
        // Format prices to match Stripe's API.
        const pricesByInterval = Object.entries(prices).flatMap(([interval, price]) => {
            return Object.entries(price).map(([currency, amount]) => ({
                interval,
                currency,
                amount,
            }));
        });
        // Create Stripe product.
        await (0, create_product_1.createStripeProduct)({
            id,
            name,
            description: description || undefined,
        });
        // Create Stripe price for the current product.
        const stripePrices = (await Promise.all(pricesByInterval.map((price) => {
            return (0, create_price_1.createStripePrice)(id, price);
        })));
        // Store product into database.
        await db_1.db.plan.create({
            data: {
                id,
                name,
                description,
                limits: {
                    create: {
                        maxItems: limits.maxItems,
                    },
                },
                prices: {
                    create: stripePrices.map((price) => ({
                        id: price.id,
                        amount: price.unit_amount,
                        currency: price.currency,
                        interval: price.recurring.interval,
                    })),
                },
            },
        });
        // Return product ID and prices.
        // Used to configure the Customer Portal.
        return {
            product: id,
            prices: stripePrices.map((price) => price.id),
        };
    });
    // Create Stripe products and stores them into database.
    const seededProducts = await Promise.all(seedProducts);
    console.log(`📦 Stripe Products has been successfully created.`);
    // Configure Customer Portal.
    await (0, configure_customer_portal_1.configureStripeCustomerPortal)(seededProducts);
    console.log(`👒 Stripe Customer Portal has been successfully configured.`);
    console.log('🎉 Visit: https://dashboard.stripe.com/test/products to see your products.');
}
seed()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
