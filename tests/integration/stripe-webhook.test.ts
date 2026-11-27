import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  constructEvent: vi.fn(),
  retrieve: vi.fn(),
  userFindUnique: vi.fn(),
  subscriptionUpdate: vi.fn(),
}))

vi.mock('#app/utils/env.server', () => ({ isMockServices: () => false }))
vi.mock('#app/modules/stripe/stripe.server', () => ({
  getStripe: () => ({
    webhooks: { constructEvent: mocks.constructEvent },
    subscriptions: { retrieve: mocks.retrieve },
  }),
}))
vi.mock('#app/utils/db.server', () => ({
  prisma: {
    user: { findUnique: mocks.userFindUnique },
    subscription: { update: mocks.subscriptionUpdate },
  },
}))
vi.mock('#app/modules/email/templates/subscription-email', () => ({
  sendSubscriptionSuccessEmail: vi.fn(),
  sendSubscriptionErrorEmail: vi.fn(),
}))

import { action } from '#app/routes/api+/webhook'

const stripeSubscription = (status: string, priceId: string) => ({
  id: 'sub_1',
  customer: 'cus_1',
  status,
  cancel_at_period_end: false,
  items: {
    data: [
      {
        plan: { product: 'prod_1', interval: 'month' },
        price: { id: priceId },
        current_period_start: 1,
        current_period_end: 2,
      },
    ],
  },
})

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubEnv('STRIPE_WEBHOOK_ENDPOINT', 'whsec_test')
  mocks.userFindUnique.mockResolvedValue({ id: 'user_1', email: 'a@example.com' })
  mocks.subscriptionUpdate.mockResolvedValue({})
})

describe('stripe webhook', () => {
  it('writes the current subscription when an older customer.subscription.updated arrives late', async () => {
    // The event payload is stale: the subscription has since changed in Stripe.
    mocks.constructEvent.mockReturnValue({
      type: 'customer.subscription.updated',
      data: { object: stripeSubscription('active', 'price_old') },
    })
    mocks.retrieve.mockResolvedValue(stripeSubscription('past_due', 'price_new'))

    await action({
      request: new Request('http://localhost/api/webhook', {
        method: 'POST',
        headers: { 'Stripe-Signature': 'sig' },
        body: '{}',
      }),
    } as Parameters<typeof action>[0])

    expect(mocks.retrieve).toHaveBeenCalledWith('sub_1')
    expect(mocks.subscriptionUpdate).toHaveBeenCalledTimes(1)
    const { data } = mocks.subscriptionUpdate.mock.calls[0][0]
    expect(data.status).toBe('past_due')
    expect(data.priceId).toBe('price_new')
  })
})
