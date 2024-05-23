import type { User } from '@prisma/client'
import { redirect } from '@remix-run/node'
import { Authenticator } from 'remix-auth'
import { TOTPStrategy } from 'remix-auth-totp'
import { GitHubStrategy } from 'remix-auth-github'
import { authSessionStorage } from '#app/modules/auth/auth-session.server'
import { sendAuthEmail } from '#app/modules/email/templates/auth-email'
import { prisma } from '#app/utils/db.server'
import { HOST_URL } from '#app/utils/misc.server'
import { ERRORS } from '#app/utils/constants/errors'
import { ROUTE_PATH as LOGOUT_PATH } from '#app/routes/auth+/logout'
import { ROUTE_PATH as MAGIC_LINK_PATH } from '#app/routes/auth+/magic-link'

export const authenticator = new Authenticator<User>(authSessionStorage)

/**
 * TOTP - Strategy.
 */
authenticator.use(
  new TOTPStrategy(
    {
      secret: process.env.ENCRYPTION_SECRET || 'NOT_A_STRONG_SECRET',
      magicLinkPath: MAGIC_LINK_PATH,
      sendTOTP: async ({ email, code, magicLink }) => {
        if (process.env.NODE_ENV === 'development') {
          // Development Only: Log the TOTP code.
          console.log('[ Dev-Only ] TOTP Code:', code)

          // Email is not sent for admin users.
          if (email.startsWith('admin')) {
            console.log('Not sending email for admin user.')
            return
          }
        }
        await sendAuthEmail({ email, code, magicLink })
      },
    },
    async ({ email }) => {
      let user = await prisma.user.findUnique({
        where: { email },
        include: {
          image: { select: { id: true } },
          roles: { select: { name: true } },
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            roles: { connect: [{ name: 'user' }] },
            email,
          },
          include: {
            image: { select: { id: true } },
            roles: {
              select: {
                name: true,
              },
            },
          },
        })
        if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED)
      }

      return user
    },
  ),
)

/**
 * Github - Strategy.
 */
authenticator.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: `${HOST_URL}/auth/github/callback`,
    },
    async ({ profile }) => {
      const email = profile._json.email || profile.emails[0].value;
      let user = await prisma.user.findUnique({
        where: { email },
        include: {
          image: { select: { id: true } },
          roles: { select: { name: true } },
        },
      })

      if (!user) {
        user = await prisma.user.create({
          data: {
            roles: { connect: [{ name: 'user' }] },
            email,
          },
          include: {
            image: { select: { id: true } },
            roles: {
              select: {
                name: true,
              },
            },
          },
        })
        if (!user) throw new Error(ERRORS.AUTH_USER_NOT_CREATED)
      }

      return user
    },
  ),
)

/**
 * Utilities.
 */
export async function requireSessionUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const sessionUser = await authenticator.isAuthenticated(request)
  if (!sessionUser) {
    if (!redirectTo) throw redirect(LOGOUT_PATH)
    else throw redirect(redirectTo)
  }
  return sessionUser
}

export async function requireUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const sessionUser = await authenticator.isAuthenticated(request)
  const user = sessionUser?.id
    ? await prisma.user.findUnique({
        where: { id: sessionUser?.id },
        include: {
          image: { select: { id: true } },
          roles: { select: { name: true } },
        },
      })
    : null
  if (!user) {
    if (!redirectTo) throw redirect(LOGOUT_PATH)
    else throw redirect(redirectTo)
  }
  return user
}
