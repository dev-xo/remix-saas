import { z } from 'zod'

const schema = z
  .object({
    NODE_ENV: z.enum(['production', 'development', 'test']),
    MOCK_SERVICES: z.enum(['true', 'false']).optional(),
    SESSION_SECRET: z.string().min(32),
    ENCRYPTION_SECRET: z.string().regex(/^[a-f0-9]{64}$/),
    DATABASE_URL: z.string().min(1),
    DEV_HOST_URL: z.string().optional(),
    PROD_HOST_URL: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_ENDPOINT: z.string().optional(),
    HONEYPOT_ENCRYPTION_SEED: z.string().min(32),
  })
  .superRefine((env, ctx) => {
    if (env.NODE_ENV === 'production') {
      if (env.MOCK_SERVICES === 'true') {
        ctx.addIssue({
          code: 'custom',
          path: ['MOCK_SERVICES'],
          message: 'Mock services are restricted to development and tests.',
        })
      }
      if (!env.PROD_HOST_URL || !URL.canParse(env.PROD_HOST_URL)) {
        ctx.addIssue({
          code: 'custom',
          path: ['PROD_HOST_URL'],
          message: 'A production URL is required.',
        })
      }
    }
    if (env.MOCK_SERVICES !== 'true') {
      for (const key of [
        'RESEND_API_KEY',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_ENDPOINT',
      ] as const) {
        if (!env[key])
          ctx.addIssue({
            code: 'custom',
            path: [key],
            message: 'Required when mock services are disabled.',
          })
      }
    }
  })

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
}

export function initEnvs() {
  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors)
    throw new Error('Invalid environment variables.')
  }
}

export function isMockServices() {
  if (process.env.MOCK_SERVICES !== 'true') return false
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Mock services are restricted to development and tests.')
  }
  return true
}
