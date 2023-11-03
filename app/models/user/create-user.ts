import type { User } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function createUser(user: Pick<User, 'email'>) {
  return db.user.create({
    data: { ...user },
  })
}
