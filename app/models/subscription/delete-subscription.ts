import type { Subscription } from '@prisma/client'
import { db } from '~/utils/db'

export async function deleteSubscriptionById(id: Subscription['id']) {
  return db.subscription.delete({
    where: { id },
  })
}
