import type { User } from '@prisma/client'
import { db } from '~/utils/db'

export async function updateUserById(id: User['id'], user: Partial<User>) {
  return db.user.update({
    where: { id },
    data: { ...user },
  })
}
