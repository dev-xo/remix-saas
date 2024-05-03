export const ERRORS = {
  // Authentication.
  AUTH_EMAIL_NOT_SENT: 'Unable to send email.',
  AUTH_USER_NOT_CREATED: 'Unable to create user.',
  AUTH_SOMETHING_WENT_WRONG: 'Something went wrong while trying to authenticate.',
  // Onboarding.
  ONBOARDING_USERNAME_ALREADY_EXISTS: 'Username already exists.',
  ONBOARDING_SOMETHING_WENT_WRONG: 'Something went wrong while trying to onboard.',
  // Stripe.
  STRIPE_MISSING_SIGNATURE: 'Unable to verify webhook signature.',
  STRIPE_MISSING_ENDPOINT_SECRET: 'Unable to verify webhook endpoint.',
  STRIPE_CUSTOMER_NOT_CREATED: 'Unable to create customer.',
  STRIPE_SOMETHING_WENT_WRONG: 'Something went wrong while trying to handle Stripe API.',
  // Misc.
  UNKNOWN: 'Unknown error.',
  ENVS_NOT_INITIALIZED: 'Environment variables not initialized.',
  SOMETHING_WENT_WRONG: 'Something went wrong.',
} as const
