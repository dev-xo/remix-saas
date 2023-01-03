import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'

import { authenticator } from '~/services/auth/config.server'
import { STRIPE_PLANS } from '~/services/stripe/plans'
import { CheckoutButton } from '~/components/stripe/checkout-button'
import { UpdatePlanButton } from '~/components/stripe/update-plan-button'

interface LoaderData {
	user: UserSession | null
}

export async function loader({ request }: DataFunctionArgs) {
	const user = await authenticator.isAuthenticated(request)
	return json<LoaderData>({ user })
}

export default function Plans() {
	// Check bellow info about why we are force casting <LoaderData>
	// https://github.com/remix-run/remix/issues/3931
	const { user } = useLoaderData() as LoaderData

	return (
		<div className="flex w-full flex-col items-center justify-start px-6 md:h-full">
			<h3 className="text-3xl font-bold text-gray-200">Select your plan</h3>
			<div className="mb-2" />
			<p className="max-w-sm text-center font-semibold text-gray-400">
				Stripe Stack is a demo app. You can test the upgrade and won't be charged.
			</p>
			<div className="mb-12" />

			{/* Displays Plans Info. */}
			<div className="flex w-full max-w-6xl flex-col items-center md:flex-row md:justify-evenly">
				{STRIPE_PLANS.map((plan) => {
					return (
						<div
							key={plan.planId}
							className="mb-12 flex flex-col items-center md:mb-0">
							{/* Plan Thumbnail. */}
							{plan.planName === STRIPE_PLANS[0].planName && (
								<img
									src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
									alt=""
									className="h-48 w-48 select-none transition hover:scale-105 hover:brightness-110"
								/>
							)}

							{plan.planName === STRIPE_PLANS[1].planName && (
								<div className="relative">
									<img
										src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
										alt=""
										className="h-48 w-48 select-none hue-rotate-60 transition hover:scale-105 hover:brightness-110"
									/>
									<img
										src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
										alt=""
										className="absolute top-[-10px] right-4 h-12 w-12 select-none hue-rotate-60 transition hover:scale-105 hover:brightness-110"
									/>
								</div>
							)}

							{plan.planName === STRIPE_PLANS[2].planName && (
								<img
									src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_2.png"
									alt=""
									className="h-48 w-48 select-none hue-rotate-[200deg] transition hover:scale-105 hover:brightness-110"
								/>
							)}
							<div className="m-4" />

							{/* Plan Price Amount. */}
							<h5 className="flex flex-row items-center text-center text-3xl font-bold text-gray-200">
								${plan.planPriceAmount}
							</h5>

							{/* Plan Price Name. */}
							<span className="text-center text-2xl font-bold text-gray-200">
								{plan.planName}
							</span>

							{/* Plan Description. */}
							<p className="text-center text-base font-semibold text-gray-400">
								{plan.planDescription}
							</p>
							<div className="m-2" />

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
