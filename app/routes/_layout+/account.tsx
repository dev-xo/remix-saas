import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { json, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'

import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'

import { hasDateExpired, formatUnixDate } from '~/lib/utils/date'
import { STRIPE_KEYS } from '~/lib/constants'
import { STRIPE_PLANS } from '~/services/stripe/plans'
import { retrieveStripeSubscription } from '~/services/stripe/api/retrieve-stripe-subscription'
import { getStripePlanValue } from '~/services/stripe/plans'
import { CustomerPortalButton } from '~/components/stripe/customer-portal-button'

export async function loader({ request }: DataFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/login',
	})

	// Gets values from Session.
	const session = await getSession(request.headers.get('Cookie'))

	const hasSuccessfullyUpdatedPlan =
		session.get(STRIPE_KEYS.HAS_SUCCESSFULLY_UPDATED_PLAN) || null

	// Checks for Subscription expiration.
	const customerId = user.subscription?.customerId
	const planId = user.subscription?.planId
	const subscriptionId = user.subscription?.subscriptionId
	const currentPeriodEnd = user.subscription?.currentPeriodEnd

	if (customerId && subscriptionId && currentPeriodEnd) {
		const hasSubscriptionExpired = hasDateExpired(currentPeriodEnd)

		// Updates Session accordingly.
		if (hasSubscriptionExpired) {
			const subscription = await retrieveStripeSubscription({ subscriptionId })

			if (subscription && subscription.status === 'canceled') {
				session.set(authenticator.sessionKey, {
					...user,
					subscription: { customerId },
				} as UserSession)

				return redirect('/account', {
					headers: {
						'Set-Cookie': await commitSession(session),
					},
				})
			}
		}
	}

	// Retrieves current subscription plan (If any).
	const purchasedPlanName =
		(planId && getStripePlanValue({ planId, value: 'planName' })) || null

	return json(
		{
			user,
			purchasedPlanName,
			hasSuccessfullyUpdatedPlan,
		},
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export default function Account() {
	const { user, purchasedPlanName, hasSuccessfullyUpdatedPlan } =
		useLoaderData<typeof loader>()

	return (
		<div className="flex w-full flex-col items-center justify-start px-6 md:h-full">
			<h3 className="text-3xl font-bold text-gray-200">Dashboard</h3>
			<div className="mb-2" />
			<p className="max-w-sm text-center font-semibold text-gray-400">
				Simple Dashboard example that includes User Info and Subscription Plan.
			</p>
			<div className="mb-12" />

			<div className="flex w-full max-w-2xl flex-col items-center md:flex-row md:justify-evenly">
				{/* User. */}
				<div className="mb-16 flex h-full w-full flex-col items-center md:mb-0">
					{/* Avatar. */}
					{user.avatar ? (
						<img
							src={user.avatar}
							alt="Avatar"
							className="h-48 w-48 select-none rounded-full transition hover:scale-105 hover:brightness-110"
						/>
					) : (
						<img
							src="https://ui-avatars.com/api/?&name=hi&background=random"
							alt="Avatar"
							className="h-48 w-48 select-none rounded-full transition hover:scale-105 hover:brightness-110"
						/>
					)}
					<div className="m-4" />

					{/* Info. */}
					<div className="flex flex-col items-center">
						<h5 className="flex flex-row items-center text-center text-2xl font-bold text-gray-200">
							{user.name}
							<div className="mr-1" />
							<svg
								className="h-7 w-7 fill-sky-400"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24">
								<path d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.138 3.712 4 5.621 4 8c0 .173.012.347.035.521C2.802 9.215 2 10.535 2 12s.802 2.785 2.035 3.479A3.976 3.976 0 0 0 4 16c0 2.379 2.138 4.283 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.283 20 18.379 20 16c0-.173-.012-.347-.035-.521C21.198 14.785 22 13.465 22 12s-.802-2.785-2.035-3.479zm-9.01 7.895-3.667-3.714 1.424-1.404 2.257 2.286 4.327-4.294 1.408 1.42-5.749 5.706z" />
							</svg>
						</h5>

						<span className="text-center text-xl font-semibold text-gray-400">
							My account
						</span>
					</div>
					<div className="mb-4" />

					{/* Delete Account Form Button. */}
					<Form
						action="/resources/user/delete-user"
						method="post"
						className="flex h-10 flex-row items-center rounded-xl border border-gray-600 px-6 
						font-bold text-gray-200 transition hover:scale-105 hover:border-red-500 hover:text-red-500 active:opacity-80">
						<button>Delete account</button>
					</Form>
				</div>

				{/* Subscription. */}
				<div className="flex h-full w-full flex-col items-center">
					{/* Subscription Images. */}
					{!purchasedPlanName && (
						<img
							src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/basket.png"
							alt=""
							className="h-48 w-48 select-none transition hover:scale-105 hover:brightness-110"
						/>
					)}
					{purchasedPlanName === STRIPE_PLANS[0].planName && (
						<img
							src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
							alt=""
							className="h-48 w-48 select-none transition hover:scale-105 hover:brightness-110"
						/>
					)}
					{purchasedPlanName === STRIPE_PLANS[1].planName && (
						<img
							src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
							alt=""
							className="h-48 w-48 select-none hue-rotate-60 transition hover:scale-105 hover:brightness-110"
						/>
					)}
					{purchasedPlanName === STRIPE_PLANS[2].planName && (
						<img
							src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_2.png"
							alt=""
							className="h-48 w-48 select-none hue-rotate-[200deg] transition hover:scale-105 hover:brightness-110"
						/>
					)}
					<div className="m-4" />

					{/* Info. */}
					<div className="flex flex-col items-center">
						<h5 className="text-center text-2xl font-bold text-gray-200">
							{purchasedPlanName ? purchasedPlanName + ' Plan' : 'Subscription'}
						</h5>

						<span className="text-center text-xl font-semibold text-gray-400">
							{!purchasedPlanName && 'Upgrade'}

							{purchasedPlanName === STRIPE_PLANS[0].planName &&
								STRIPE_PLANS[0].planDescription}

							{purchasedPlanName === STRIPE_PLANS[1].planName &&
								STRIPE_PLANS[1].planDescription}

							{purchasedPlanName === STRIPE_PLANS[2].planName &&
								STRIPE_PLANS[2].planDescription}
						</span>
						<div className="mb-4" />

						{/* Displays a Link to `/plans` route. */}
						{!user.subscription?.subscriptionId && (
							<Link
								to="/plans"
								prefetch="intent"
								className="flex h-10 flex-row items-center justify-center rounded-xl bg-violet-500 px-6 
								font-bold text-gray-100 transition hover:scale-105 active:opacity-80">
								<button>Subscribe</button>
							</Link>
						)}

						{/* Customer Portal Component. */}
						{user.subscription?.customerId && (
							<>
								{!user.subscription.subscriptionId && <div className="mb-4" />}
								<CustomerPortalButton />
							</>
						)}

						{/* Displays formated expiration date. */}
						{user.subscription?.subscriptionId && (
							<>
								<div className="mb-4" />
								<p className="text-center text-sm font-bold text-gray-400">
									{user.subscription?.cancelAtPeriodEnd === true
										? 'EXPIRES'
										: 'RENEWS'}
									:{' '}
									<span className="text-gray-200">
										{user.subscription.currentPeriodEnd &&
											formatUnixDate(user.subscription.currentPeriodEnd)}
									</span>
								</p>
								<div className="mb-3" />
							</>
						)}
					</div>
				</div>
			</div>

			{hasSuccessfullyUpdatedPlan && (
				<div
					className="absolute left-1/2 top-5 z-30 flex min-h-[40px] -translate-x-1/2 transform 
					flex-row items-center rounded-full bg-violet-500 px-6">
					<p className="whitespace-nowrap text-base font-bold text-gray-200">
						Subscription has successfully updated.
					</p>
				</div>
			)}
		</div>
	)
}
