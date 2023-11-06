import type { LoaderFunctionArgs } from '@remix-run/node'

import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

import { getUserById } from '~/models/user/get-user'
import { updateUserById } from '~/models/user/update-user'
import { createStripeCustomer } from '~/services/stripe/api/create-customer'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const user = await getUserById(session.id)
  if (!user) return redirect('/login')
  if (user.customerId) return redirect('/account')

  // Create Stripe Customer.
  const email = user.email ? user.email : undefined
  const name = user.name ? user.name : undefined

  const customer = await createStripeCustomer({ email, name })
  if (!customer) throw new Error('Unable to create Stripe Customer.')

  // Update user.
  await updateUserById(user.id, { customerId: customer.id })

  return redirect('/account')
}
