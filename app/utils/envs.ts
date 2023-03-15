declare global {
  var ENV: ENV

  interface Window {
    ENV: {
      NODE_ENV: 'development' | 'production' | 'test'
      DEV_HOST_URL: string
      PROD_HOST_URL: string
    }
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      SESSION_SECRET: string
      ENCRYPTION_SECRET: string
      DATABASE_URL: string

      DEV_HOST_URL: string
      PROD_HOST_URL: string

      EMAIL_PROVIDER_API_KEY: string
      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string

      STRIPE_PUBLIC_KEY: string
      STRIPE_SECRET_KEY: string
      DEV_STRIPE_WEBHOOK_ENDPOINT: string
      PROD_STRIPE_WEBHOOK_ENDPOINT: string
    }
  }
}

/**
 * Exports shared environment variables.
 *
 * Shared envs are used in both `entry.server.ts` and `root.tsx`.
 * Do not share sensible variables that you do not wish to be included in the client.
 */
export function getSharedEnvs() {
  return {
    DEV_HOST_URL: process.env.DEV_HOST_URL,
    PROD_HOST_URL: process.env.PROD_HOST_URL,
  }
}

type ENV = ReturnType<typeof getSharedEnvs>
