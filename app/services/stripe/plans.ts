export interface StripePlan {
	planId: string
	planName: string
	planPriceAmount: number
	planDescription: string
}

export interface StripePlans extends Array<StripePlan> {}

/**
 * Stripe Plans.
 * Add Stripe `priceIds` into `.env` file and manage them on here.
 */
export const STRIPE_PLANS: StripePlans = [
	{
		planId: ENV.PLAN_1_PRICE_ID,
		planName: 'Basic',
		planPriceAmount: 0.1,
		planDescription: '1 Cookie per Day!',
	},
	{
		planId: ENV.PLAN_2_PRICE_ID,
		planName: 'Creative',
		planPriceAmount: 0.3,
		planDescription: '3 Cookies per Day!',
	},
	{
		planId: ENV.PLAN_3_PRICE_ID,
		planName: 'PRO',
		planPriceAmount: 0.9,
		planDescription: 'Infinite Cookies per Day!',
	},
]

/**
 * Gets a value from `STRIPE_PLANS` based on `planId`.
 */
export function getValueFromStripePlans(
	planId: StripePlan['planId'],
	value: keyof StripePlan,
) {
	return STRIPE_PLANS.find((plan) => plan.planId === planId)?.[value]
}
