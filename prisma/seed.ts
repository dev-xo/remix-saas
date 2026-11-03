import { initEnvs, isMockServices } from '#app/utils/env.server'
import type { Interval } from '#app/modules/stripe/plans'
import { getStripe } from '#app/modules/stripe/stripe.server'
import { PRICING_PLANS } from '#app/modules/stripe/plans'
import { prisma } from '#app/utils/db.server.ts'

async function seed() {
  initEnvs()
  /**
   * Users, Roles and Permissions.
   */
  const entities = ['user']
  const actions = ['create', 'read', 'update', 'delete']
  const accesses = ['own', 'any'] as const
  for (const entity of entities) {
    for (const action of actions) {
      for (const access of accesses) {
        await prisma.permission.upsert({
          where: { action_entity_access: { entity, action, access } },
          update: {},
          create: { entity, action, access },
        })
      }
    }
  }

  await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: 'any' },
        }),
      },
    },
  })
  await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      permissions: {
        connect: await prisma.permission.findMany({
          select: { id: true },
          where: { access: 'own' },
        }),
      },
    },
  })
  if (isMockServices())
    await prisma.user.upsert({
      where: { email: 'admin@admin.com' },
      update: {},
      select: { id: true },
      create: {
        email: 'admin@admin.com',
        username: 'admin',
        roles: { connect: [{ name: 'admin' }, { name: 'user' }] },
      },
    })

  console.info(`🎭 User roles and permissions has been successfully created.`)

  /**
   * Stripe Products.
   */
  if (isMockServices()) {
    for (const { id, name, description, prices } of Object.values(PRICING_PLANS)) {
      await prisma.plan.upsert({
        where: { id },
        update: { name, description },
        create: { id, name, description },
      })
      for (const [interval, amounts] of Object.entries(prices)) {
        for (const [currency, amount] of Object.entries(amounts)) {
          const price = { planId: id, interval, currency, amount }
          const priceId = `local_${id}_${interval}_${currency}`
          await prisma.price.upsert({
            where: { id: priceId },
            update: price,
            create: { id: priceId, ...price },
          })
        }
      }
    }
    console.info('Local plans seeded. Stripe was not contacted.')
    return
  }

  const products = await getStripe().products.list({
    limit: 3,
  })
  if (products?.data?.length) {
    console.info('🏃‍♂️ Skipping Stripe products creation and seeding.')
    return true
  }

  const seedProducts = Object.values(PRICING_PLANS).map(
    async ({ id, name, description, prices }) => {
      // Format prices to match Stripe's API.
      const pricesByInterval = Object.entries(prices).flatMap(([interval, price]) => {
        return Object.entries(price).map(([currency, amount]) => ({
          interval,
          currency,
          amount,
        }))
      })

      // Create Stripe product.
      await getStripe().products.create({
        id,
        name,
        description: description || undefined,
      })

      // Create Stripe price for the current product.
      const stripePrices = await Promise.all(
        pricesByInterval.map((price) => {
          return getStripe().prices.create({
            product: id,
            currency: price.currency ?? 'usd',
            unit_amount: price.amount ?? 0,
            tax_behavior: 'inclusive',
            recurring: {
              interval: (price.interval as Interval) ?? 'month',
            },
          })
        }),
      )

      // Store product into database.
      await prisma.plan.create({
        data: {
          id,
          name,
          description,
          prices: {
            create: stripePrices.map((price) => ({
              id: price.id,
              amount: price.unit_amount ?? 0,
              currency: price.currency,
              interval: price.recurring?.interval ?? 'month',
            })),
          },
        },
      })

      // Return product ID and prices.
      // Used to configure the Customer Portal.
      return {
        product: id,
        prices: stripePrices.map((price) => price.id),
      }
    },
  )

  // Create Stripe products and stores them into database.
  const seededProducts = await Promise.all(seedProducts)
  console.info(`📦 Stripe Products has been successfully created.`)

  // Configure Customer Portal.
  await getStripe().billingPortal.configurations.create({
    business_profile: {
      headline: 'Organization Name - Customer Portal',
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ['address', 'shipping', 'tax_id', 'email'],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: { enabled: true },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ['price'],
        proration_behavior: 'always_invoice',
        products: seededProducts.filter(({ product }) => product !== 'free'),
      },
    },
  })

  console.info(`👒 Stripe Customer Portal has been successfully configured.`)
  console.info(
    '🎉 Visit: https://dashboard.getStripe().com/test/products to see your products.',
  )
}

seed()
  .catch(async (err) => {
    console.error(err)
    await prisma.$disconnect()
    process.exit(1)
  })
  .then(async () => {
    await prisma.$disconnect()
  })
