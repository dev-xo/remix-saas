import type { DataFunctionArgs } from '@remix-run/node'
import type { UserSession } from '~/services/auth/session.server'

import { useEffect, useState } from 'react'
import { json, redirect } from '@remix-run/node'
import { Link, useLoaderData, useSubmit } from '@remix-run/react'

import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'
import { getUserById } from '~/models/user/get-user'
import { STRIPE_KEYS } from '~/lib/constants'

interface LoaderData {
	hasSuccessfullySubscribed: boolean | null
}

export async function loader({ request }: DataFunctionArgs) {
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// Early exit if user is already subscribed.
	if (user && user.subscription?.subscriptionId) return redirect('/account')

	// Gets values from Session.
	const session = await getSession(request.headers.get('Cookie'))
	const hasSuccessfullySubscribed =
		session.get(STRIPE_KEYS.HAS_SUCCESSFULLY_SUBSCRIBED) || false

	// Checks for user existence in database.
	const dbUser = await getUserById(user.id, {
		subscription: true,
	})
	if (!dbUser) throw new Error('User not found in database.')

	// Gets params from URL.
	const url = new URL(request.url)
	const cancelPayment = url.searchParams.get('cancel')

	// Updates Session with latest database data.
	// Sets `customerId` in Session, avoiding duplicate Stripe Customer creation.
	if (cancelPayment) {
		session.set(authenticator.sessionKey, {
			...user,
			subscription: { ...dbUser.subscription },
		} as UserSession)

		return redirect('/plans', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		})
	}

	// On `subscriptionId` in database, updates Session accordingly.
	// This confirms that the user has been successfully subscribed.
	if (dbUser.subscription?.subscriptionId) {
		session.set(authenticator.sessionKey, {
			...user,
			subscription: { ...dbUser.subscription },
		} as UserSession)

		// Updates Session with the intent to skip subscription re-fetch.
		session.flash(STRIPE_KEYS.HAS_SUCCESSFULLY_SUBSCRIBED, true)

		return json(
			{ hasSuccessfullySubscribed: true },
			{
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			},
		)
	}

	// On `subscriptionId` not in database, updates Session accordingly.
	// This confirms that the user has not been subscribed.
	if (!dbUser.subscription?.subscriptionId) {
		// Updates Session with the intent to re-fetch subscription.
		session.flash(STRIPE_KEYS.HAS_SUCCESSFULLY_SUBSCRIBED, false)

		return json(
			{ hasUnsuccessfullySubscribed: true },
			{
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			},
		)
	}

	return json<LoaderData>(
		{ hasSuccessfullySubscribed },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export default function Checkout() {
	const submit = useSubmit()

	// Check bellow info about why we are force casting <LoaderData>
	// https://github.com/remix-run/remix/issues/3931
	const { hasSuccessfullySubscribed } = useLoaderData() as LoaderData
	const [hasLoadedSpinner, setHasLoadedSpinner] = useState(false)

	const reFetchSubscription = () => {
		setHasLoadedSpinner(false)
		submit(null, { method: 'get' })
	}

	// Using Effect with the intent to await for Stripe Webhook
	// to update Subscription database.
	useEffect(() => {
		if (!hasLoadedSpinner) {
			setTimeout(() => setHasLoadedSpinner(true), 8000)
		}
	}, [hasLoadedSpinner])

	return (
		<div className="flex flex-col items-center justify-center px-6 md:h-full">
			{!hasSuccessfullySubscribed && !hasLoadedSpinner && (
				<>
					<svg
						className="h-16 w-16 animate-spin fill-gray-200 hover:fill-violet-200"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24">
						<path d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536 1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071 3.536-3.535 1.414 1.415-3.536 3.535z" />
					</svg>
					<div className="mb-6" />

					<h3 className="text-3xl font-bold text-gray-200">
						Completing your checkout ...
					</h3>
					<div className="mb-2" />
					<p className="max-w-sm text-center font-semibold text-gray-400">
						This step will take us a few seconds.
					</p>
				</>
			)}

			{hasSuccessfullySubscribed && (
				<>
					<img
						src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/hundred.png"
						alt=""
						className="h-48 w-48 select-none transition hover:scale-105 hover:brightness-110"
					/>
					<div className="mb-6" />

					<h3 className="text-3xl font-bold text-gray-200">Checkout completed!</h3>
					<div className="mb-2" />
					<p className="max-w-sm text-center font-semibold text-gray-400">
						Enjoy your new subscription plan!
					</p>
					<div className="mb-6" />

					<Link to="/account" prefetch="none">
						<button
							className="flex min-h-[40px] flex-row items-center justify-center rounded-xl bg-violet-500 px-6 
							font-bold text-gray-100 transition hover:scale-105 active:brightness-90">
							<span>Return to Dashboard</span>
						</button>
					</Link>
				</>
			)}

			{hasLoadedSpinner && !hasSuccessfullySubscribed && (
				<>
					<img
						src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/melt.png"
						alt=""
						className="h-48 w-48 select-none transition hover:scale-105 hover:brightness-110"
					/>
					<div className="mb-6" />

					<h3 className="text-3xl font-bold text-gray-200">Whops!</h3>
					<div className="mb-2" />
					<p className="max-w-sm text-center font-semibold text-gray-400">
						We are sorry! Try again bellow, or contact us directly at
						example@mail.com and we will solve it!
					</p>
					<div className="mb-6" />

					<button
						onClick={() => reFetchSubscription()}
						className="flex min-h-[40px] flex-row items-center justify-center rounded-xl bg-violet-500 px-6 
							font-bold text-gray-100 transition hover:scale-105 active:brightness-90">
						<span>Try Again</span>
					</button>
				</>
			)}
		</div>
	)
}
