import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'
import { getSubscriptionByUserId } from '~/models/subscription/get-subscription'

export async function loader({ request }: DataFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: '/login' })
  const subscription = await getSubscriptionByUserId(user.id)

  if (!subscription) return redirect('/account')

  const subscriptionHasBeenUpdated = user.subscription?.id !== subscription?.id
  const subscriptionHasBeenCanceled = subscription.status === 'canceled'

  // Update session.
  const session = await getSession(request.headers.get('Cookie'))

  if (subscriptionHasBeenUpdated || subscriptionHasBeenCanceled) {
    session.set(authenticator.sessionKey, {
      ...user,
      subscription: {
        ...subscription,
      },
    } as UserSession)

    return redirect('/account', {
      headers: { 'Set-Cookie': await commitSession(session) },
    })
  }
}
