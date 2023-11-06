import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'
import { getUserById } from '~/models/user/get-user'
import { createStripeCustomerPortalSession } from '~/services/stripe/api/create-customer-portal'

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  })
  return redirect('/account')
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  })

  const user = await getUserById(session.id)
  if (!user) return redirect('/login')

  // Redirect to Customer Portal.
  if (user.customerId) {
    const customerPortalUrl = await createStripeCustomerPortalSession(user.customerId)
    return redirect(customerPortalUrl)
  }

  return json({}, { status: 400 })
}
