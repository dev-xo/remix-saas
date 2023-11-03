import type { User } from '@prisma/client'

import { Authenticator } from 'remix-auth'
import { OTPStrategy } from 'remix-auth-otp'
import { SocialsProvider, GoogleStrategy } from 'remix-auth-socials'
import { sessionStorage } from '~/services/auth/session.server'

import { getUserByEmail } from '~/models/user/get-user'
import { createUser } from '~/models/user/create-user'

import { db } from '~/utils/db.server'
import { HOST_URL } from '~/utils/http'
import { sendEmail } from '~/services/email/config.server'

/**
 * Inits Authenticator.
 */
export let authenticator = new Authenticator<User>(sessionStorage, {
  throwOnError: true,
})

/**
 * Google - Strategy.
 */
authenticator.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: `${HOST_URL}/auth/${SocialsProvider.GOOGLE}/callback`,
      prompt: 'consent',
    },
    async ({ profile }) => {
      // Get user from database.
      let user = await getUserByEmail(profile._json.email)

      if (!user) {
        user = await createUser({ email: profile._json.email })
        if (!user) throw new Error('Unable to create user.')
      }

      // Return user as Session.
      return user
    },
  ),
)

/**
 * One Time Password - Strategy.
 */
authenticator.use(
  new OTPStrategy(
    {
      secret: process.env.ENCRYPTION_SECRET || 'STRONG_SECRET',

      // Magic generation.
      magicLinkGeneration: {
        callbackPath: '/auth/magic',
      },

      // Store code in database.
      storeCode: async (code) => {
        await db.otp.create({
          data: {
            code: code,
            active: true,
            attempts: 0,
          },
        })
      },

      // Send code to user.
      sendCode: async ({ email, code, magicLink, user, form, request }) => {
        const sender = { name: 'Remix Auth OTP', email: 'localhost@example.com' }
        const to = [{ email }]
        const subject = `Here's your OTP Code!`
        const htmlContent = `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html>
            <head>
              <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
            </head>
            <body style="max-width: 50%; margin: 0 auto; text-align: center;">
              <h1>Code: ${code}</h1>
              ${
                magicLink &&
                `<p style="font-size: 16px;">
                  Alternatively, you can click the Magic Link URL.
                  <br />
                  <a href="${magicLink}">${magicLink}</a>
                </p>`
              }
            </body>
          </html>
          `

        // Call provider sender email function.
        await sendEmail({ sender, to, subject, htmlContent })
      },

      // Validate code.
      validateCode: async (code) => {
        const otp = await db.otp.findUnique({
          where: { code: code },
        })
        if (!otp) throw new Error('Code not found.')

        return {
          code: otp.code,
          active: otp.active,
          attempts: otp.attempts,
        }
      },

      // Invalidate code.
      invalidateCode: async (code, active, attempts) => {
        await db.otp.update({
          where: {
            code: code,
          },
          data: {
            active: active,
            attempts: attempts,
          },
        })
      },
    },
    async ({ email }) => {
      // Get user from database.
      let user = await getUserByEmail(email)

      if (!user) {
        user = await createUser({ email })
        if (!user) throw new Error('Unable to create user.')
      }

      // Return user as Session.
      return user
    },
  ),
)
