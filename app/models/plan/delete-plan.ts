import type { Plan } from '@prisma/client'
import { db } from '~/utils/db'

export async function deletePlanById(id: Plan['id']) {
  return db.plan.delete({
    where: { id },
  })
}
