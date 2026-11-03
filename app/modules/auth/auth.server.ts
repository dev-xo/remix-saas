import type { Prisma, User } from '@prisma/client'
import { redirect } from '@remix-run/node'
import { Authenticator } from 'remix-auth'
import { TOTPStrategy } from 'remix-auth-totp'
import { GitHubStrategy } from 'remix-auth-github'
import {
  getSession,
  commitSession,
  destroySession,
} from '#app/modules/auth/auth-session.server'
import {
  readTOTPState,
  unwrapTOTPRequest,
  signTOTPResponse,
} from '#app/modules/auth/totp-cookie.server'
import { isMockServices } from '#app/utils/env.server'
import { sendAuthEmail } from '#app/modules/email/templates/auth-email'
import { prisma } from '#app/utils/db.server'
import { HOST_URL } from '#app/utils/misc.server'
import { ROUTE_PATH as LOGOUT_PATH } from '#app/routes/auth+/logout'
import { ROUTE_PATH as MAGIC_LINK_PATH } from '#app/routes/auth+/magic-link'

const userInclude = {
  image: { select: { id: true } },
  roles: { select: { name: true } },
} as const

type AuthUser = Prisma.UserGetPayload<{ include: typeof userInclude }>
const userQueries = new WeakMap<Request, Promise<AuthUser | null>>()

function findOrCreateUser(email: string) {
  return prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, roles: { connect: [{ name: 'user' }] } },
    include: userInclude,
  })
}

async function readSessionUser(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))
  const userId = session.get('userId')
  return typeof userId === 'string'
    ? prisma.user.findUnique({ where: { id: userId }, include: userInclude })
    : null
}

function getSessionUser(request: Request) {
  // Reuse lookups only for reads. Actions must see fresh data after mutations.
  if (request.method !== 'GET' && request.method !== 'HEAD')
    return readSessionUser(request)
  let user = userQueries.get(request)
  if (!user) {
    user = readSessionUser(request)
    userQueries.set(request, user)
  }
  return user
}

export const authenticator = new Authenticator<User>()

/**
 * TOTP - Strategy.
 */
authenticator.use(
  new TOTPStrategy(
    {
      secret: process.env.ENCRYPTION_SECRET || 'NOT_A_STRONG_SECRET',
      magicLinkPath: MAGIC_LINK_PATH,
      emailSentRedirect: '/auth/verify',
      successRedirect: '/dashboard',
      failureRedirect: '/auth/verify',
      cookieOptions: process.env.NODE_ENV === 'production' ? { secure: true } : {},
      sendTOTP: async ({ email, code, magicLink }) => {
        if (isMockServices()) {
          console.info(`[Local auth] ${email} — Code: ${code} — Magic link: ${magicLink}`)
          return
        }
        await sendAuthEmail({ email, code, magicLink })
      },
    },
    async ({ email }) => {
      const user = await findOrCreateUser(email)
      throw await createUserSession(user)
    },
  ),
)

/**
 * Github - Strategy.
 */
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET)
  authenticator.use(
    new GitHubStrategy(
      {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        scopes: ['user:email'],
        redirectURI: `${HOST_URL}/auth/github/callback`,
      },
      async ({ tokens }) => {
        const response = await fetch('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
            Accept: 'application/vnd.github+json',
          },
        })
        if (!response.ok) throw new Error('Unable to retrieve GitHub email.')
        const emails: { email: string; primary: boolean; verified: boolean }[] =
          await response.json()
        const email = emails.find((entry) => entry.primary && entry.verified)?.email
        if (!email) throw new Error('A verified primary GitHub email is required.')
        return findOrCreateUser(email)
      },
    ),
  )

/**
 * Utilities.
 */
export async function requireUser(
  request: Request,
  { redirectTo = LOGOUT_PATH }: { redirectTo?: string | null } = {},
) {
  const user = await getSessionUser(request)
  if (!user) throw redirect(redirectTo || LOGOUT_PATH)
  return user
}

export const requireSessionUser = requireUser

export async function isAuthenticated(
  request: Request,
  options: { successRedirect?: string } = {},
) {
  const user = await getSessionUser(request)
  if (user && options.successRedirect) throw redirect(options.successRedirect)
  return user
}

async function createUserSession(user: User) {
  // Start a fresh session after authentication.
  const session = await getSession()
  session.set('userId', user.id)
  return redirect('/dashboard', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}

export async function authenticate(provider: string, request: Request) {
  if (provider !== 'TOTP' && provider !== 'github')
    throw new Response('Unknown authentication provider.', { status: 404 })
  if (
    provider === 'github' &&
    (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET)
  ) {
    throw new Response('GitHub login is not configured. Use email login.', {
      status: 404,
    })
  }
  try {
    const authRequest = provider === 'TOTP' ? await unwrapTOTPRequest(request) : request
    const user = await authenticator.authenticate(provider, authRequest)
    return createUserSession(user)
  } catch (error) {
    if (provider === 'TOTP' && error instanceof Response)
      throw await signTOTPResponse(error)
    throw error
  }
}

export async function getAuthState(request: Request) {
  const state = new URLSearchParams(await readTOTPState(request))
  const message = state.get('error')
  return { authEmail: state.get('email'), authError: message ? { message } : null }
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get('Cookie'))
  const headers = new Headers({ 'Set-Cookie': await destroySession(session) })
  headers.append('Set-Cookie', '_totp=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
  return redirect('/', { headers })
}
