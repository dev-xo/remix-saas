import { afterEach, describe, expect, it, vi } from 'vitest'

import { sendEmail } from '#app/modules/email/email.server'

// Unit tests for the email module. Verifies the provider is env-driven
// (Resend by default, any Resend-API-compatible ESP via EMAIL_API_*) and that
// env is read at call time so it can be configured per environment.

const OK_RESPONSE = (body: unknown) =>
  ({ ok: true, json: async () => body }) as unknown as Response

describe('sendEmail', () => {
  const originalFetch = globalThis.fetch
  const envKeys = [
    'EMAIL_API_URL',
    'EMAIL_API_KEY',
    'EMAIL_FROM',
    'RESEND_API_KEY',
  ]

  afterEach(() => {
    globalThis.fetch = originalFetch
    for (const key of envKeys) delete process.env[key]
  })

  it('defaults to Resend when only RESEND_API_KEY is set (back-compat).', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(OK_RESPONSE({ id: 're_123' }))

    await sendEmail({ to: 'user@example.com', subject: 'Hi', html: '<p/>' })

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.resend.com/emails')
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer re_test_key',
      'Content-Type': 'application/json',
    })
    const body = JSON.parse(init.body as string)
    expect(body.from).toBe('onboarding@resend.dev')
    expect(body.to).toBe('user@example.com')
  })

  it('routes to MailKite when EMAIL_API_* is configured.', async () => {
    process.env.EMAIL_API_URL = 'https://api.mailkite.dev/v1/send'
    process.env.EMAIL_API_KEY = 'mk_test_key'
    process.env.EMAIL_FROM = 'noreply@yourdomain.com'
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(OK_RESPONSE({ id: 'msg_123', status: 'sent' }))

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Hi',
      html: '<p/>',
    })

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.mailkite.dev/v1/send')
    expect(init.headers).toMatchObject({
      Authorization: 'Bearer mk_test_key',
    })
    const body = JSON.parse(init.body as string)
    expect(body.from).toBe('noreply@yourdomain.com')
    // MailKite returns { id, status }; the success schema only needs { id }.
    expect(result).toEqual({
      status: 'success',
      data: { success: true, data: { id: 'msg_123' } },
    })
  })

  it('prefers EMAIL_API_KEY over RESEND_API_KEY.', async () => {
    process.env.EMAIL_API_KEY = 'mk_preferred'
    process.env.RESEND_API_KEY = 're_fallback'
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(OK_RESPONSE({ id: 'x' }))

    await sendEmail({ to: 'u@e.com', subject: 's', html: '<p/>' })

    const init = fetchMock.mock.calls[0][1] as RequestInit
    expect(init.headers).toMatchObject({ Authorization: 'Bearer mk_preferred' })
  })

  it('throws when no API key is configured.', async () => {
    await expect(
      sendEmail({ to: 'u@e.com', subject: 's', html: '<p/>' }),
    ).rejects.toThrow('Environment variables not initialized.')
  })

  it('throws AUTH_EMAIL_NOT_SENT on a non-ok response.', async () => {
    process.env.RESEND_API_KEY = 're_test_key'
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ name: 'validation_error', message: 'bad', statusCode: 422 }),
    } as unknown as Response)

    await expect(
      sendEmail({ to: 'u@e.com', subject: 's', html: '<p/>' }),
    ).rejects.toThrow('Unable to send email.')
  })
})
