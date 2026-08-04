import { z } from 'zod'
import { ERRORS } from '#app/utils/constants/errors'

// Success/error shapes are Resend's, but any provider that mirrors Resend's
// REST API works here too — MailKite (https://mailkite.dev) is one example.
const ResendSuccessSchema = z.object({
  id: z.string(),
})
const ResendErrorSchema = z.union([
  z.object({
    name: z.string(),
    message: z.string(),
    statusCode: z.number(),
  }),
  z.object({
    name: z.literal('UnknownError'),
    message: z.literal('Unknown Error'),
    statusCode: z.literal(500),
    cause: z.any(),
  }),
])

export type SendEmailOptions = {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail(options: SendEmailOptions) {
  // Provider is configurable via env so any Resend-API-compatible ESP can be
  // used. Defaults keep Resend as the provider, so existing setups are
  // unchanged. To use MailKite instead, set:
  //   EMAIL_API_URL=https://api.mailkite.dev/v1/send
  //   EMAIL_API_KEY=<your MailKite API key>
  //   EMAIL_FROM=you@yourverifieddomain.com
  const apiUrl = process.env.EMAIL_API_URL ?? 'https://api.resend.com/emails'
  const apiKey = process.env.EMAIL_API_KEY ?? process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM ?? 'onboarding@resend.dev'

  if (!apiKey) {
    throw new Error(`Email - ${ERRORS.ENVS_NOT_INITIALIZED}`)
  }

  const email = { from, ...options }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(email),
  })

  const data = await response.json()
  const parsedData = ResendSuccessSchema.safeParse(data)

  if (response.ok && parsedData.success) {
    return { status: 'success', data: parsedData } as const
  } else {
    const parsedErrorResult = ResendErrorSchema.safeParse(data)
    if (parsedErrorResult.success) {
      console.error(parsedErrorResult.data)
      throw new Error(ERRORS.AUTH_EMAIL_NOT_SENT)
    } else {
      console.error(data)
      throw new Error(ERRORS.AUTH_EMAIL_NOT_SENT)
    }
  }
}
