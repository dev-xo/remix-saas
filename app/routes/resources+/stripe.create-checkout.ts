import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

import { redirect } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

import { getUserById } from '~/models/user/get-user'
import { getPlanById } from '~/models/plan/get-plan'
import { getDefaultCurrency } from '~/utils/locales'
import { createStripeCheckoutSession } from '~/services/stripe/api/create-checkout'

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, { failureRedirect: '/login' })
  return redirect('/account')
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/',
  })

  const user = await getUserById(session.id)
  if (!user) return redirect('/login')
  if (!user.customerId) throw new Error('Unable to get Customer ID.')

  // Get form values.
  const formData = Object.fromEntries(await request.formData())
  const formDataParsed = JSON.parse(formData.plan as string)
  const planId = String(formDataParsed.planId)
  const planInterval = String(formDataParsed.planInterval)

  if (!planId || !planInterval)
    throw new Error('Missing required parameters to create Stripe Checkout Session.')

  // Get client's currency.
  const defaultCurrency = getDefaultCurrency(request)

  // Get price ID for the requested plan.
  const plan = await getPlanById(planId, { prices: true })
  const planPrice = plan?.prices.find(
    (price) => price.interval === planInterval && price.currency === defaultCurrency,
  )
  if (!planPrice) throw new Error('Unable to find a Plan price.')

  // Redirect to Checkout.
  const checkoutUrl = await createStripeCheckoutSession(user.customerId, planPrice.id)
  return redirect(checkoutUrl)
}
