import type { Plan } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function updatePlanById(id: Plan['id'], plan: Partial<Plan>) {
  return db.plan.update({
    where: { id },
    data: { ...plan },
  })
}
