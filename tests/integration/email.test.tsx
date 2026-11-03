import { afterEach, expect, it, vi } from 'vitest'
import { sendEmail } from '#app/modules/email/email.server'
import { renderAuthEmailEmail } from '#app/modules/email/templates/auth-email'

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

it('renders the updated email components and renderer', async () => {
  const html = await renderAuthEmailEmail({
    email: 'local@example.com',
    code: 'ABC123',
    magicLink: 'http://localhost:3000/auth/magic-link?t=test',
  })
  expect(html).toContain('ABC123')
  expect(html).toContain('/auth/magic-link?t=test')
})

it('keeps local email delivery off the network', async () => {
  vi.stubEnv('NODE_ENV', 'test')
  vi.stubEnv('MOCK_SERVICES', 'true')
  const fetch = vi.fn()
  vi.stubGlobal('fetch', fetch)
  vi.spyOn(console, 'info').mockImplementation(() => {})
  expect(
    await sendEmail({ to: 'local@example.com', subject: 'Test', html: '<p>Test</p>' }),
  ).toMatchObject({ status: 'success' })
  expect(fetch).not.toHaveBeenCalled()
})
