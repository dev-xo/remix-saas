import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getSession, destroySession } from '~/services/auth/session.server'

import { getUserById } from '~/models/user/get-user'
import { deleteUserById } from '~/models/user/delete-user'
import { deleteStripeCustomer } from '~/services/stripe/api/delete-customer'

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: '/login' })
  return redirect('/account')
}

export async function action({ request }: ActionFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const user = await getUserById(userSession.id)
  if (!user) return redirect('/login')

  // Delete user from database.
  await deleteUserById(user.id)

  // Delete Stripe Customer.
  if (user.customerId) await deleteStripeCustomer(user.customerId)

  // Destroy session.
  let session = await getSession(request.headers.get('Cookie'))
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  })
}
