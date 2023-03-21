import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'

import { createStripeCustomer } from '~/services/stripe/api/create-customer'
import { updateUserById } from '~/models/user/update-user'

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  if (user.customerId) return redirect('/account')

  // Create Stripe Customer.
  const email = user.email ? user.email : undefined
  const name = user.name ? user.name : undefined

  const customer = await createStripeCustomer({ email, name })
  if (!customer) throw new Error('Unable to create Stripe Customer.')

  // Update user.
  await updateUserById(user.id, {
    customerId: customer.id,
  })

  // Update session.
  const session = await getSession(request.headers.get('Cookie'))

  session.set(authenticator.sessionKey, {
    ...user,
    customerId: customer.id,
  } as UserSession)

  return redirect('/account', {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
