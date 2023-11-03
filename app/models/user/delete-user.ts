import type { User } from '@prisma/client'
import { db } from '~/utils/db.server'

export async function deleteUserById(id: User['id']) {
  return db.user.delete({
    where: { id },
  })
}
