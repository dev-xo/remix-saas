import { createCookie } from '@remix-run/node'
import { parseCookie, parseSetCookie, stringifyCookie } from 'cookie'

// The strategy keeps the email and challenge in one cookie. Sign the whole
// state so a client cannot change the email associated with a valid challenge.
const totpCookie = createCookie('_totp', {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 300,
  secure: process.env.NODE_ENV === 'production',
  secrets: [process.env.SESSION_SECRET || 'NOT_A_STRONG_SECRET'],
})

export async function readTOTPState(request: Request) {
  const cookies = parseCookie(request.headers.get('Cookie') ?? '', {
    decode: (value) => value,
  })
  if (!cookies._totp) return ''
  const state: unknown = await totpCookie.parse(request.headers.get('Cookie'))
  if (typeof state !== 'string')
    throw new Response('Invalid login state. Please log in again.', { status: 400 })
  return state
}

export async function unwrapTOTPRequest(request: Request) {
  const cookies = parseCookie(request.headers.get('Cookie') ?? '', {
    decode: (value) => value,
  })
  const state = await readTOTPState(request)
  if (state) cookies._totp = state
  else delete cookies._totp
  const headers = new Headers(request.headers)
  headers.set('Cookie', stringifyCookie(cookies, { encode: (value) => value }))
  return new Request(request, { headers })
}

export async function signTOTPResponse(response: Response) {
  const headers = new Headers(response.headers)
  const cookies = headers.getSetCookie()
  headers.delete('Set-Cookie')
  let state: string | undefined
  for (const cookie of cookies) {
    const parsed = parseSetCookie(cookie, { decode: (value) => value })
    if (parsed.name === '_totp') state = parsed.value
    else headers.append('Set-Cookie', cookie)
  }
  if (state !== undefined) headers.append('Set-Cookie', await totpCookie.serialize(state))
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}
