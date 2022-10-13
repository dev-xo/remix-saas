import type { LoaderFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { authenticator } from '~/modules/auth'
import { STRIPE_PLANS } from '~/modules/stripe'
import {
	CreateCheckoutButton,
	UpdatePlanButton,
} from '~/modules/stripe/components'

type LoaderData = {
	user: Awaited<AuthSession> | null
}

/**
 * Remix - Loader.
 * @required Template code.
 */
export const loader: LoaderFunction = async ({ request }) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/login',
	})

	return json<LoaderData>({ user })
}

export default function PlansRoute() {
	const { user } = useLoaderData() as LoaderData

	return (
		<div className="m-12 mx-auto flex h-auto w-full max-w-7xl flex-col items-center px-6 sm:h-full">
			<h3 className="text-3xl font-bold text-gray-700 dark:text-gray-300">
				Choose Plan
			</h3>
			<div className="mb-12" />

			<div className="flex h-full w-full flex-col items-center px-6 md:flex-row md:items-start md:justify-center">
				{/* Displays Plans Info. */}
				{STRIPE_PLANS.map((plan) => {
					return (
						<div
							key={plan.planId}
							className="flex w-full flex-col items-center pb-12 sm:mb-0 sm:max-w-[33%] md:pb-0">
							{/* Plan Thumbnail. */}
							{plan.planName === STRIPE_PLANS[0].planName && (
								<div className="relative flex flex-row justify-center transition hover:scale-110">
									<img
										src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/basket.png"
										alt=""
										className="h-44 w-44 select-none opacity-40 drop-shadow-xl"
									/>
									<div className="absolute top-6 flex flex-row items-center justify-center">
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="h-16 w-16 animate-pulse drop-shadow-lg"
										/>
									</div>
								</div>
							)}

							{plan.planName === STRIPE_PLANS[1].planName && (
								<div className="relative flex flex-row justify-center transition hover:scale-110">
									<img
										src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/basket.png"
										alt=""
										className="h-44 w-44 select-none opacity-60 drop-shadow-xl"
									/>
									<div className="absolute top-6 flex flex-row items-center justify-center">
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="relative left-4 h-16 w-16 animate-pulse drop-shadow-lg"
										/>
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="h-16 w-16 animate-pulse drop-shadow-lg"
										/>
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="relative right-4 h-16 w-16 animate-pulse drop-shadow-lg"
										/>
									</div>
								</div>
							)}

							{plan.planName === STRIPE_PLANS[2].planName && (
								<div className="relative flex flex-row justify-center transition hover:scale-110">
									<img
										src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/basket.png"
										alt=""
										className="h-44 w-44 select-none opacity-80 drop-shadow-xl"
									/>
									<div className="absolute top-6 flex flex-row items-center justify-center">
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="relative left-10 h-16 w-16 animate-pulse drop-shadow-lg"
										/>
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="relative left-4 h-16 w-16 animate-pulse drop-shadow-lg"
										/>
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="h-16 w-16 animate-pulse drop-shadow-lg"
										/>
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="relative right-4 h-16 w-16 animate-pulse drop-shadow-lg"
										/>
										<img
											src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
											alt=""
											className="relative right-10 h-16 w-16 animate-pulse drop-shadow-lg"
										/>
									</div>
								</div>
							)}
							<div className="m-3" />

							{/* Plan Price Amount. */}
							<h5 className="text-2xl font-bold text-gray-700 dark:text-gray-400">
								{plan.planPriceAmount}$
							</h5>

							{/* Plan Name. */}
							<h5 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
								{plan.planName}
							</h5>
							<div className="m-3" />

							{/* Plan Description. */}
							<p className="text-center text-lg font-semibold text-gray-500 dark:text-gray-400">
								{plan.planDescription}
							</p>
							<div className="m-3" />

							{/* Renders `CreateCheckoutButton` component. */}
							{!user?.subscription[0]?.subscriptionId && (
								<CreateCheckoutButton
									planId={plan.planId}
									planName={plan.planName}
								/>
							)}

							{/* Renders `UpdatePlanButton` component. */}
							{user?.subscription[0]?.planId && (
								<UpdatePlanButton
									planId={plan.planId}
									purchasedPlanId={user.subscription[0].planId}
								/>
							)}
						</div>
					)
				})}
			</div>
		</div>
	)
}
