"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRICING_PLANS = void 0;
/**
 * Defines our plans structure.
 */
exports.PRICING_PLANS = {
    ["free" /* PlanId.FREE */]: {
        id: "free" /* PlanId.FREE */,
        name: 'Free',
        description: 'Free Plan Description',
        features: ['1 Star per Minute', 'Limited to 9 Stars'],
        limits: { maxItems: 9 },
        prices: {
            ["month" /* Interval.MONTH */]: {
                ["usd" /* Currency.USD */]: 0,
                ["eur" /* Currency.EUR */]: 0,
            },
            ["year" /* Interval.YEAR */]: {
                ["usd" /* Currency.USD */]: 0,
                ["eur" /* Currency.EUR */]: 0,
            },
        },
    },
    ["starter" /* PlanId.STARTER */]: {
        id: "starter" /* PlanId.STARTER */,
        name: 'Starter',
        description: 'Starter Plan Description',
        features: ['4 Stars per Minute', 'Limited to 99 Stars'],
        limits: { maxItems: 99 },
        prices: {
            ["month" /* Interval.MONTH */]: {
                ["usd" /* Currency.USD */]: 990,
                ["eur" /* Currency.EUR */]: 990,
            },
            ["year" /* Interval.YEAR */]: {
                ["usd" /* Currency.USD */]: 9990,
                ["eur" /* Currency.EUR */]: 9990,
            },
        },
    },
    ["pro" /* PlanId.PRO */]: {
        id: "pro" /* PlanId.PRO */,
        name: 'Pro',
        description: 'Pro Plan Description',
        features: ['8 Stars per Minute', 'Limited to 999 Stars'],
        limits: { maxItems: 999 },
        prices: {
            ["month" /* Interval.MONTH */]: {
                ["usd" /* Currency.USD */]: 1990,
                ["eur" /* Currency.EUR */]: 1990,
            },
            ["year" /* Interval.YEAR */]: {
                ["usd" /* Currency.USD */]: 19990,
                ["eur" /* Currency.EUR */]: 19990,
            },
        },
    },
};
