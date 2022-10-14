import type { LoaderFunction } from '@remix-run/node'
import type { AuthSession } from '~/modules/auth'

import { redirect, json } from '@remix-run/node'
import { useLoaderData, Link } from '@remix-run/react'
import { authenticator, getSession, commitSession } from '~/modules/auth'
import { getValueFromStripePlans } from '~/modules/stripe'
import { formatUnixDate, hasDateExpired } from '~/utils'

import { DeleteUserButton } from '~/modules/user/components'
import { CreateCustomerPortalButton } from '~/modules/stripe/components'

type LoaderData = {
	user: Awaited<AuthSession> | null
	hasSuccessfullySubscribed: boolean | null
	hasSuccessfullyUpdatedPlan: boolean | null
	purchasedPlanName: string | number | null
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

	// Parses `__auth` Cookie and returns the associated Session.
	const session = await getSession(request.headers.get('Cookie'))

	// Gets flash values from Session.
	const skipExpirationCheck = session.get('SKIP_EXPIRATION_CHECK') || false

	const hasSuccessfullySubscribed =
		session.get('HAS_SUCCESSFULLY_SUBSCRIBED') || null

	const hasSuccessfullyUpdatedPlan =
		session.get('HAS_SUCCESSFULLY_UPDATED_PLAN') || null

	// Checks for Subscription expiration.
	// If expried: Updates Auth Session accordingly.
	if (
		user &&
		user.subscription?.currentPeriodEnd &&
		skipExpirationCheck === false
	) {
		const currentPeriodEnd = user.subscription.currentPeriodEnd
		const hasSubscriptionExpired = hasDateExpired(currentPeriodEnd)

		const HOST_URL =
			process.env.NODE_ENV === 'development'
				? process.env.DEV_HOST_URL
				: process.env.PROD_HOST_URL

		if (hasSubscriptionExpired)
			return redirect(
				`${HOST_URL}/resources/stripe/update-subscription-expired`,
			)
	}

	// Retrieves the name of the current Subscription plan. (If any)
	const purchasedPlanName =
		(user?.subscription?.planId &&
			getValueFromStripePlans(user.subscription.planId, 'planName')) ||
		null

	// Returns a JSON Response and resets flashing Session variables.
	return json<LoaderData>(
		{
			user,
			hasSuccessfullySubscribed,
			hasSuccessfullyUpdatedPlan,
			purchasedPlanName,
		},
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export default function AccountRoute() {
	const {
		user,
		hasSuccessfullySubscribed,
		hasSuccessfullyUpdatedPlan,
		purchasedPlanName,
	} = useLoaderData() as LoaderData

	return (
		<div className="m-12 mx-auto flex h-full w-full max-w-4xl flex-col px-6 sm:flex-row">
			{/* User Account. */}
			{user && (
				<div className="flex w-full flex-col items-center">
					{/* Avatar. */}
					<div className="relative flex flex-col">
						{user.avatar && (
							<img
								src={user.avatar}
								alt="Avatar"
								className="h-44 w-44 select-none rounded-full shadow-xl transition hover:scale-110"
							/>
						)}
					</div>
					<div className="m-3" />

					{/* Info. */}
					<div className="flex flex-col items-center">
						<h5 className="relative flex flex-row items-center text-3xl font-bold text-gray-900 dark:text-gray-100">
							{user.name}
							<svg
								className="absolute -right-9 h-7 w-7 fill-sky-500"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24">
								<path d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.138 3.712 4 5.621 4 8c0 .173.012.347.035.521C2.802 9.215 2 10.535 2 12s.802 2.785 2.035 3.479A3.976 3.976 0 0 0 4 16c0 2.379 2.138 4.283 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.283 20 18.379 20 16c0-.173-.012-.347-.035-.521C21.198 14.785 22 13.465 22 12s-.802-2.785-2.035-3.479zm-9.01 7.895-3.667-3.714 1.424-1.404 2.257 2.286 4.327-4.294 1.408 1.42-5.749 5.706z" />
							</svg>
						</h5>
						<div className="mb-1" />
						<span className="font-semibold text-gray-700 dark:text-gray-400">
							My account
						</span>
					</div>
					<div className="mb-3" />

					{/* Renders `DeleteUserButton` button component. */}
					<DeleteUserButton />
				</div>
			)}
			<div className="mb-8" />

			{/* Subscription Related. */}
			{user && (
				<div className="flex w-full flex-col items-center">
					<div className="relative flex flex-row justify-center transition hover:scale-110">
						<img
							src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/basket.png"
							alt=""
							className="h-44 w-44 select-none opacity-40 drop-shadow-xl"
						/>

						{/* Purchased Plans. */}
						{!purchasedPlanName && (
							<div className="absolute top-6 flex flex-row items-center justify-center">
								<img
									src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
									alt=""
									className="h-16 w-16 animate-pulse drop-shadow-lg"
								/>
							</div>
						)}

						{purchasedPlanName === 'Basic' && (
							<div className="absolute top-6 flex flex-row items-center justify-center">
								<img
									src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/stripe-stack/assets/images/cookie.png"
									alt=""
									className="h-16 w-16 animate-pulse drop-shadow-lg"
								/>
							</div>
						)}

						{purchasedPlanName === 'Creative' && (
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
						)}

						{purchasedPlanName === 'PRO' && (
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
						)}
					</div>
					<div className="m-3" />

					{/* Displays Subscription Plan. */}
					<h5 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
						{purchasedPlanName ? purchasedPlanName + ' Plan' : 'Subscription'}
					</h5>
					<div className="mb-1" />

					{/* Displays a message if there is no Subscription. */}
					{!user.subscription?.subscriptionId && (
						<>
							<p className="text-center font-semibold text-gray-500 dark:text-gray-400">
								Subscribe to get some tasty Cookies!
							</p>
							<div className="mb-3" />
						</>
					)}

					{/* Displays formated Subscription expiration date. */}
					{user.subscription?.subscriptionId && (
						<>
							<p className="font-bold text-gray-700 dark:text-gray-400">
								{user.subscription?.cancelAtPeriodEnd === true ? (
									<span className="text-red-500">EXPIRES</span>
								) : (
									<span className="text-gray-900 dark:text-gray-100">
										RENEWS
									</span>
								)}
								:{' '}
								{user.subscription.currentPeriodEnd &&
									formatUnixDate(user.subscription.currentPeriodEnd)}
							</p>
							<div className="mb-3" />
						</>
					)}

					{/* Displays a message if Subscription renew has been cancelled. */}
					{user.subscription?.cancelAtPeriodEnd === true && (
						<>
							<p className="text-center font-semibold text-gray-500 dark:text-gray-400">
								Your plan will be cancelled but your subscription benefits will
								still active until expiration date.
							</p>
							<div className="mb-3" />
						</>
					)}

					{/* Displays a Link Button to `/plans` route. */}
					<Link to="/plans">
						<button className="flex h-9 flex-row items-center justify-center rounded-xl bg-violet-500 px-12 text-base font-bold text-white transition hover:scale-105 active:scale-100">
							<span>
								{!user.subscription?.subscriptionId ? 'Subscribe' : 'Plans'}
							</span>
						</button>
					</Link>

					{/* Renders `CreateCustomerPortalButton` component. */}
					{user.subscription?.customerId && (
						<>
							<div className="mb-3" />
							<CreateCustomerPortalButton />
						</>
					)}

					{/* Displays Checkout Success Message. */}
					{hasSuccessfullySubscribed && (
						<div
							className="select-noneflex-row absolute top-9 left-0 right-0 z-20 m-auto flex
							w-[300px] transform justify-center transition hover:scale-110">
							<p className="rounded-2xl bg-violet-500 p-2 px-12 font-bold text-white shadow-2xl">
								Successfully Subscribed
							</p>
						</div>
					)}

					{/* Displays Updated Plan Success Message. */}
					{hasSuccessfullyUpdatedPlan && (
						<div
							className="select-noneflex-row absolute top-9 left-0 right-0 z-20 m-auto flex
							w-[400px] transform justify-center transition hover:scale-110">
							<p className="rounded-2xl bg-violet-500 p-2 px-12 font-bold text-white shadow-2xl">
								Plan has been Successfully Updated.
							</p>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
