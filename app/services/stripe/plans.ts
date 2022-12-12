export interface StripePlan {
	planId: string
	planName: string
	planPriceAmount: number
	planDescription: string
}
export interface StripePlans extends Array<StripePlan> {}

/**
 * Stripe Plans.
 * Add Stripe `priceIds` into `.env` as `STRIPE_PLAN_X_PRICE_ID` and manage them bellow.
 */
export const STRIPE_PLANS: StripePlans = [
	{
		planId: ENV.STRIPE_PLAN_1_PRICE_ID,
		planName: 'Basic',
		planPriceAmount: 3,
		planDescription: '1 Star every 5 minutes!',
	},
	{
		planId: ENV.STRIPE_PLAN_2_PRICE_ID,
		planName: 'Creative',
		planPriceAmount: 8,
		planDescription: '10 Stars every 3 minutes!',
	},
	{
		planId: ENV.STRIPE_PLAN_3_PRICE_ID,
		planName: 'PRO',
		planPriceAmount: 12,
		planDescription: '100 Stars every minute!',
	},
]

/**
 * Helpers.
 */
interface GetStripePlanParams {
	planId: StripePlan['planId']
	value: keyof StripePlan
}

export function getStripePlanValue({ planId, value }: GetStripePlanParams) {
	return STRIPE_PLANS.find((plan) => plan.planId === planId)?.[value]
}
