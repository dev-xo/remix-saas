/**
 * Shared envs are used in both `entry.server.ts` and `root.tsx`.
 * Do not share sensible variables that you do not wish to
 * be included in the client.
 */
export function getGlobalEnvs() {
	return {
		STRIPE_PLAN_1_PRICE_ID: process.env.STRIPE_PLAN_1_PRICE_ID,
		STRIPE_PLAN_2_PRICE_ID: process.env.STRIPE_PLAN_2_PRICE_ID,
		STRIPE_PLAN_3_PRICE_ID: process.env.STRIPE_PLAN_3_PRICE_ID,
	}
}
