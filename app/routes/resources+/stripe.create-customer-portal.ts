import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'

import { getSubscriptionByUserId } from '~/models/subscription/get-subscription'
import { createStripeCustomerPortalSession } from '~/services/stripe/api/create-customer-portal'

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  })
  const subscription = await getSubscriptionByUserId(user.id)

  // Update session.
  // User may have update subscription / payment method / etc.
  if (subscription?.id) {
    const session = await getSession(request.headers.get('Cookie'))

    session.set(authenticator.sessionKey, {
      ...user,
      subscription: { ...subscription },
    } as UserSession)

    return redirect('/account', {
      headers: { 'Set-Cookie': await commitSession(session) },
    })
  }

  return redirect('/account')
}

export async function action({ request }: DataFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  })

  // Redirect to Customer Portal.
  if (user.customerId) {
    const customerPortalUrl = await createStripeCustomerPortalSession(user.customerId)
    return redirect(customerPortalUrl)
  }

  // Whops!
  return json({}, { status: 400 })
}
