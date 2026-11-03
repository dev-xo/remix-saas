import { beforeEach, expect, it, vi } from 'vitest'
import { getSession, commitSession } from '#app/modules/auth/auth-session.server'
import { isAuthenticated, requireUser } from '#app/modules/auth/auth.server'

const { findUnique } = vi.hoisted(() => ({ findUnique: vi.fn() }))
vi.mock('#app/utils/db.server', () => ({
  prisma: { user: { findUnique, upsert: vi.fn() } },
}))

const user = {
  id: 'test-user',
  username: 'before',
  roles: [{ name: 'user' }],
  image: null,
}

async function authenticatedRequest(method = 'GET') {
  const session = await getSession()
  session.set('userId', user.id)
  const cookie = await commitSession(session)
  return new Request('http://localhost/dashboard', {
    method,
    headers: { Cookie: cookie.split(';')[0] },
  })
}

beforeEach(() => findUnique.mockReset().mockResolvedValue(user))

it('shares the user lookup between auth helpers for the same read request', async () => {
  const request = await authenticatedRequest()
  expect(await isAuthenticated(request)).toEqual(user)
  expect(await requireUser(request)).toEqual(user)
  expect(findUnique).toHaveBeenCalledTimes(1)
})

it('revalidates the user on a new request after account deletion', async () => {
  findUnique.mockResolvedValueOnce(user).mockResolvedValueOnce(null)
  expect(await isAuthenticated(await authenticatedRequest())).toEqual(user)
  await expect(
    requireUser(await authenticatedRequest(), { redirectTo: '/auth/login' }),
  ).rejects.toMatchObject({ status: 302 })
  expect(findUnique).toHaveBeenCalledTimes(2)
})

it('reads fresh user data after a mutation on the same POST request', async () => {
  const request = await authenticatedRequest('POST')
  expect(await requireUser(request)).toEqual(user)
  const updated = { ...user, username: 'after' }
  findUnique.mockResolvedValue(updated)
  expect(await requireUser(request)).toEqual(updated)
  expect(findUnique).toHaveBeenCalledTimes(2)
})
