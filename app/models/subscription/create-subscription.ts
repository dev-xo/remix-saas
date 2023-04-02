import type { Subscription } from '@prisma/client'
import { db } from '~/utils/db'

export async function createSubscription(
  subscription: Omit<Subscription, 'createdAt' | 'updatedAt'>,
) {
  return db.subscription.create({
    data: { ...subscription },
  })
}
