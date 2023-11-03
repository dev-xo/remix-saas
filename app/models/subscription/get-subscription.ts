import type { User, Subscription } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function getSubscriptionById(id: Subscription['id']) {
  return db.subscription.findUnique({
    where: { id },
  })
}

export async function getSubscriptionByUserId(userId: User['id']) {
  return db.subscription.findUnique({
    where: { userId },
  })
}
