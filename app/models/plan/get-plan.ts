import type { Prisma, Plan } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function getPlanById(id: Plan['id'], include?: Prisma.PlanInclude) {
  return db.plan.findUnique({
    where: { id },
    include: {
      ...include,
      prices: include?.prices || false,
    },
  })
}

export async function getAllPlans(include?: Prisma.PlanInclude) {
  return db.plan.findMany({
    include: {
      ...include,
      prices: include?.prices || false,
    },
  })
}
