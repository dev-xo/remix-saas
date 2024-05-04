import type { ActionFunctionArgs } from '@remix-run/router'
import { requireUser } from '#app/modules/auth/auth.server'
import { prisma } from '#app/utils/db.server.js'

export const ROUTE_PATH = '/resources/reset-image' as const

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request)
  await prisma.userImage.deleteMany({ where: { userId: user.id } })
  return null
}
