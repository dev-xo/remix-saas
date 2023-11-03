import type { Plan } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function createPlan(plan: Omit<Plan, 'createdAt' | 'updatedAt'>) {
  return db.plan.create({
    data: { ...plan },
  })
}
