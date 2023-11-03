import type { User } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function getUserById(id: User['id']) {
  return db.user.findUnique({
    where: { id },
  })
}

export async function getUserByEmail(email: User['email']) {
  return db.user.findUnique({
    where: { email },
  })
}

export async function getUserByCustomerId(customerId: User['customerId']) {
  if (!customerId) throw new Error('Missing required parameters to retrieve User.')

  return db.user.findUnique({
    where: { customerId },
  })
}
