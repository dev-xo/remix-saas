/**
 * Utils.
 * @protected Template code.
 */
export interface StripePlanInterface {
	planId: string
	planName: string
	planPriceAmount: number
	planDescription: string
}

export interface StripePlansInterface extends Array<StripePlanInterface> {}

/**
 * Feel free to add more plans on `.env`file
 * and managing them on here.
 */
export const STRIPE_PLANS: StripePlansInterface = [
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
 * Helper.
 * Returns plan name, based on `planId`.
 */
export const getPurchasedPlanName = (planId: StripePlanInterface['planId']) =>
	STRIPE_PLANS.find((plan) => plan.planId === planId)?.planName
