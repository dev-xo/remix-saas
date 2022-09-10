declare global {
	namespace NodeJS {
		interface ProcessEnv {
			/**
			 * BASE
			 */
			NODE_ENV: 'development' | 'production' | 'test'
			SESSION_SECRET: string
			/**
			 * BASE URLs
			 */
			DEV_HOST_URL: string
			PROD_HOST_URL: string

			/**
			 * AUTH
			 */
			GOOGLE_CLIENT_ID: string
			GOOGLE_CLIENT_SECRET: string

			GITHUB_CLIENT_ID: string
			GITHUB_CLIENT_SECRET: string

			TWITTER_CLIENT_ID: string
			TWITTER_CLIENT_SECRET: string

			DISCORD_CLIENT_ID: string
			DISCORD_CLIENT_SECRET: string

			/**
			 * STRIPE
			 */
			STRIPE_PUBLIC_KEY: string
			STRIPE_SECRET_KEY: string

			/**
			 * STRIPE PLANS
			 */
			PLAN_1_PRICE_ID: string
			PLAN_2_PRICE_ID: string
			PLAN_3_PRICE_ID: string

			/**
			 * STRIPE WEBHOOK
			 */
			DEV_STRIPE_WEBHOOK_ENDPOINT_SECRET: string
			PROD_STRIPE_WEBHOOK_ENDPOINT_SECRET: string
		}
	}
}

declare global {
	var ENV: ENV
	interface Window {
		ENV: ENV
	}
}

type ENV = ReturnType<typeof getGlobalEnvs>

/**
 * Global Shared Envs.
 */
export const getGlobalEnvs = () => {
	return {
		PLAN_1_PRICE_ID: process.env.PLAN_1_PRICE_ID,
		PLAN_2_PRICE_ID: process.env.PLAN_2_PRICE_ID,
		PLAN_3_PRICE_ID: process.env.PLAN_3_PRICE_ID,
	}
}
