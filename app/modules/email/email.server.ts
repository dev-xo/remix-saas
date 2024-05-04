import { z } from 'zod'
import { ERRORS } from '#app/utils/constants/errors'

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
  if (!process.env.RESEND_API_KEY) {
    throw new Error(`Resend - ${ERRORS.ENVS_NOT_INITIALIZED}`)
  }

  const from = 'onboarding@resend.dev'
  const email = { from, ...options }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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
