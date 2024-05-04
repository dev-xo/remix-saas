/**
 * Learn more about Honeypot protection:
 * @see https://github.com/sergiodxa/remix-utils?tab=readme-ov-file#form-honeypot
 */
import { Honeypot, SpamError } from 'remix-utils/honeypot/server'

export const honeypot = new Honeypot({
  encryptionSeed: process.env.HONEYPOT_ENCRYPTION_SEED,
})

export function checkHoneypot(formData: FormData) {
  try {
    honeypot.check(formData)
  } catch (err: unknown) {
    if (err instanceof SpamError) {
      throw new Response('Form not submitted properly', { status: 400 })
    }
    throw err
  }
}
