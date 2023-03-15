import type { PlanLimit, Price } from '@prisma/client'

/**
 * Defines our plans IDs.
 */
export const enum PlanId {
  FREE = 'free',
  STARTER = 'starter',
  PRO = 'pro',
}

/**
 * Defines our plan pricing intervals.
 */
export const enum Interval {
  MONTH = 'month',
  YEAR = 'year',
}

/**
 * Defines our plan pricing currencies.
 */
export const enum Currency {
  DEFAULT_CURRENCY = 'usd',
  USD = 'usd',
  EUR = 'eur',
}

/**
 * Defines our plans structure.
 */
export const PRICING_PLANS = {
  [PlanId.FREE]: {
    id: PlanId.FREE,
    name: 'Free',
    description: 'Free Plan Description',
    features: ['1 Star per Minute', 'Limited to 9 Stars'],
    limits: { maxItems: 9 },
    prices: {
      [Interval.MONTH]: {
        [Currency.USD]: 0,
        [Currency.EUR]: 0,
      },
      [Interval.YEAR]: {
        [Currency.USD]: 0,
        [Currency.EUR]: 0,
      },
    },
  },
  [PlanId.STARTER]: {
    id: PlanId.STARTER,
    name: 'Starter',
    description: 'Starter Plan Description',
    features: ['4 Stars per Minute', 'Limited to 99 Stars'],
    limits: { maxItems: 99 },
    prices: {
      [Interval.MONTH]: {
        [Currency.USD]: 990,
        [Currency.EUR]: 990,
      },
      [Interval.YEAR]: {
        [Currency.USD]: 9990,
        [Currency.EUR]: 9990,
      },
    },
  },
  [PlanId.PRO]: {
    id: PlanId.PRO,
    name: 'Pro',
    description: 'Pro Plan Description',
    features: ['8 Stars per Minute', 'Limited to 999 Stars'],
    limits: { maxItems: 999 },
    prices: {
      [Interval.MONTH]: {
        [Currency.USD]: 1990,
        [Currency.EUR]: 1990,
      },
      [Interval.YEAR]: {
        [Currency.USD]: 19990,
        [Currency.EUR]: 19990,
      },
    },
  },
} satisfies PricingPlan

/**
 * A helper type that defines our price by interval.
 */
export type PriceInterval<
  I extends Interval = Interval,
  C extends Currency = Currency,
> = {
  [interval in I]: {
    [currency in C]: Price['amount']
  }
}

/**
 * A helper type that defines our pricing plans structure by Interval.
 */
export type PricingPlan<T extends PlanId = PlanId> = {
  [key in T]: {
    id: string
    name: string
    description: string
    features: string[]
    limits: Pick<PlanLimit, 'maxItems'>
    prices: PriceInterval
  }
}
