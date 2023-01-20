import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'

import { authenticator } from '~/services/auth/config.server'
import { STRIPE_PLANS } from '~/services/stripe/plans'
import { CheckoutButton } from '~/components/stripe/checkout-button'
import { UpdatePlanButton } from '~/components/stripe/update-plan-button'
import { getStripePlanValue } from '~/services/stripe/plans'

interface LoaderData {
	user: UserSession | null
	purchasedPlanId: string | number | string[] | null
}

export async function loader({ request }: DataFunctionArgs) {
	const user = await authenticator.isAuthenticated(request)
	const planId = user?.subscription?.planId

	// Retrieves current Subscription plan (If any).
	const purchasedPlanId = (planId && getStripePlanValue(planId, 'planId')) || null
	return json<LoaderData>({ user, purchasedPlanId })
}

export default function Plans() {
	// Check bellow info about why we are force casting <LoaderData>
	// https://github.com/remix-run/remix/issues/3931
	const { user, purchasedPlanId } = useLoaderData() as LoaderData

	return (
		<div className="flex w-full flex-col items-center justify-start px-6 md:h-full">
			<h3 className="text-3xl font-bold text-gray-200">Select your plan</h3>
			<div className="mb-2" />
			<p className="max-w-sm text-center font-semibold text-gray-400">
				Stripe Stack is a demo app. You can test the upgrade and won't be charged.
			</p>
			<div className="mb-12" />

			{/* Displays Plans Info. */}
			<div className="flex w-full max-w-6xl flex-col items-center md:flex-row md:justify-center">
				{STRIPE_PLANS.map((plan) => {
					return (
						<div
							key={plan.planId}
							className={`mx-2 mb-12 flex flex-col items-center px-6 py-8 hover:opacity-100 md:mb-0 ${
								purchasedPlanId && purchasedPlanId !== plan.planId && 'opacity-60'
							}`}>
							{/* Plan Thumbnail. */}
							{plan.planName === STRIPE_PLANS[0].planName && (
								<img
									src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
									alt=""
									className="h-24 w-24 select-none transition hover:scale-105 hover:brightness-110"
								/>
							)}

							{plan.planName === STRIPE_PLANS[1].planName && (
								<div className="relative">
									<img
										src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
										alt=""
										className="h-24 w-24 select-none hue-rotate-60 transition hover:scale-105 hover:brightness-110"
									/>
									<img
										src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
										alt=""
										className="absolute top-[-10px] right-0 h-8 w-8 select-none opacity-60 hue-rotate-60 transition hover:scale-105 hover:brightness-110"
									/>
								</div>
							)}

							{plan.planName === STRIPE_PLANS[2].planName && (
								<img
									src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_2.png"
									alt=""
									className="h-24 w-24 select-none hue-rotate-[200deg] transition hover:scale-105 hover:brightness-110"
								/>
							)}
							<div className="m-4" />

							{/* Plan Name. */}
							<span className="text-2xl font-semibold text-gray-200">
								{plan.planName}
							</span>
							<div className="mb-6" />

							{/* Plan Price Amount. */}
							<h5 className="flex flex-row items-center text-5xl font-bold text-gray-200">
								${plan.planPriceAmount}
								<small className="relative top-2 left-1 text-lg text-gray-400">
									/mo
								</small>
							</h5>
							<div className="mb-6" />

							{/* Plan Features. */}
							{plan.planFeatures.map((feature) => {
								return (
									<div key={feature}>
										<p
											key={feature}
											className="flex flex-row whitespace-nowrap text-center text-base font-medium text-gray-400">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="6 h-6 w-6 fill-gray-400"
												viewBox="0 0 24 24">
												<path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z" />
											</svg>
											<div className="mx-1" />
											{feature}
										</p>
										<div className="mb-1" />
									</div>
								)
							})}

							<div className="mb-12" />

							{/* Checkout Component. */}
							{user && !user.subscription?.subscriptionId && (
								<CheckoutButton planId={plan.planId} planName={plan.planName} />
							)}

							{/* Update Plan Component. */}
							{user && user.subscription?.planId && (
								<UpdatePlanButton
									planId={plan.planId}
									purchasedPlanId={user.subscription.planId}
								/>
							)}
						</div>
					)
				})}
			</div>

			{!user && (
				<Link to="/login" prefetch="intent">
					<button
						className="flex min-h-[40px] flex-row items-center justify-center rounded-xl bg-violet-500 px-6 
						font-bold text-gray-100 transition hover:scale-105 active:brightness-90">
						<span>Get Started</span>
					</button>
				</Link>
			)}
		</div>
	)
}
