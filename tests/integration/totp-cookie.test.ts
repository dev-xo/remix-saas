import { describe, expect, it } from 'vitest'
import { parseSetCookie, stringifyCookie } from 'cookie'
import {
  readTOTPState,
  signTOTPResponse,
  unwrapTOTPRequest,
} from '#app/modules/auth/totp-cookie.server'

describe('TOTP cookie transport', () => {
  it('signs the email and challenge together, preserving the login session cookie', async () => {
    const state = 'email=alice%40example.com&totp=challenge'
    const headers = new Headers({ Location: '/auth/verify' })
    headers.append('Set-Cookie', `_totp=${state}; Path=/; HttpOnly`)
    headers.append('Set-Cookie', '_auth=session; Path=/; HttpOnly')
    const response = await signTOTPResponse(new Response(null, { status: 302, headers }))
    expect(response.headers.getSetCookie()).toHaveLength(2)
    expect(response.headers.get('Location')).toBe('/auth/verify')
    const cookie = response.headers
      .getSetCookie()
      .map((item) => parseSetCookie(item))
      .find((item) => item.name === '_totp')!
    const request = new Request('http://localhost/auth/verify', {
      headers: { Cookie: stringifyCookie({ _totp: cookie.value }) },
    })
    expect(await readTOTPState(request)).toBe(state)
    const unwrapped = await unwrapTOTPRequest(request)
    expect(unwrapped.headers.get('Cookie')).toContain('alice')
  })
  it('rejects unsigned or tampered email state', async () => {
    const request = new Request('http://localhost/auth/verify', {
      headers: { Cookie: '_totp=email%3Dadmin%40admin.com' },
    })
    await expect(readTOTPState(request)).rejects.toMatchObject({ status: 400 })
  })
})
