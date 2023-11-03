import type { Plan } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function deletePlanById(id: Plan['id']) {
  return db.plan.delete({
    where: { id },
  })
}
