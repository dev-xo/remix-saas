import type { getGlobalEnvs } from '~/lib/utils/envs'

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			// Base.
			NODE_ENV: 'development' | 'production' | 'test'
			SESSION_SECRET: string
			ENCRYPTION_SECRET: string

			// Base URLs.
			DEV_HOST_URL: string
			PROD_HOST_URL: string

			// Database.
			DATABASE_URL: string

			// [Optional] Email Provider.
			EMAIL_PROVIDER_API_KEY: string

			// [Optional] Auth Clients.
			GOOGLE_CLIENT_ID: string
			GOOGLE_CLIENT_SECRET: string

			GITHUB_CLIENT_ID: string
			GITHUB_CLIENT_SECRET: string

			TWITTER_CLIENT_ID: string
			TWITTER_CLIENT_SECRET: string

			DISCORD_CLIENT_ID: string
			DISCORD_CLIENT_SECRET: string

			// Stripe.
			STRIPE_PUBLIC_API_KEY: string
			STRIPE_SECRET_API_KEY: string

			// Stripe Plans.
			STRIPE_PLAN_1_PRICE_ID: string
			STRIPE_PLAN_2_PRICE_ID: string
			STRIPE_PLAN_3_PRICE_ID: string

			// Stripe Webhook.
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
