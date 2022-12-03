export interface StripePlan {
	planId: string
	planName: string
	planPriceAmount: number
	planDescription: string
}

export interface StripePlans extends Array<StripePlan> {}

/**
 * Stripe Plans.
 * Add `priceIds` into `.env` and manage them bellow.
 */
export const STRIPE_PLANS: StripePlans = [
	{
		planId: ENV.PLAN_1_PRICE_ID,
		planName: 'Basic',
		planPriceAmount: 3,
		planDescription: '1 Star every 5 minutes!',
	},
	{
		planId: ENV.PLAN_2_PRICE_ID,
		planName: 'Creative',
		planPriceAmount: 8,
		planDescription: '10 Stars every 3 minutes!',
	},
	{
		planId: ENV.PLAN_3_PRICE_ID,
		planName: 'PRO',
		planPriceAmount: 12,
		planDescription: '100 Stars every minute!',
	},
]
