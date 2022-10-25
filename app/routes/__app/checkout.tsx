import type { LoaderArgs } from '@remix-run/node'
import type { AuthSession } from '~/services/auth/session.server'

import { useEffect } from 'react'
import { redirect, json } from '@remix-run/node'
import { useLoaderData, useSubmit } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'
import { getUserByIdIncludingSubscription } from '~/models/user.server'

/**
 * Remix - Loader.
 * @required Template code.
 */
type LoaderData = {
	hasSkippedSubscriptionCheck: boolean | false
	hasSuccessfullySubscribed: boolean | false
}

export const loader = async ({ request }: LoaderArgs) => {
	// Checks for Auth Session.
	const user = await authenticator.isAuthenticated(request, {
		failureRedirect: '/',
	})

	// Early exit, avoiding Session updates.
	if (user.subscription?.subscriptionId) return redirect('/account')

	// Checks for User existence in database.
	const dbUser = await getUserByIdIncludingSubscription(user.id)
	if (!dbUser) throw new Error('User not found in database.')

	// Parses a Cookie and returns its associated Session.
	// Gets flash values from Session.
	const session = await getSession(request.headers.get('Cookie'))
	const skipSubscriptionCheck = session.get('SKIP_SUBSCRIPTION_CHECK') || false

	// On Subscription ID existence: Updates Auth Session accordingly.
	if (dbUser.subscription?.subscriptionId) {
		session.set(authenticator.sessionKey, {
			...user,
			subscription: { ...dbUser.subscription },
		} as AuthSession)

		// Sets a flash value in Session, used to enhance UI experience.
		session.flash('HAS_SUCCESSFULLY_SUBSCRIBED', true)

		return redirect('/account', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		})
	}

	// If Subscription ID has not been found,
	// sets a flash value in Session, allowing the cycle to repeat.
	if (skipSubscriptionCheck === false) {
		// Sets a flash value in Session, used to enhance UI experience.
		session.flash('SKIP_SUBSCRIPTION_CHECK', true)

		// Updates Auth Session with newly created Checkout values.
		// Like Customer ID.
		session.set(authenticator.sessionKey, {
			...user,
			subscription: { ...dbUser.subscription },
		} as AuthSession)

		return json<LoaderData>(
			{
				hasSkippedSubscriptionCheck: false,
				hasSuccessfullySubscribed: false,
			},
			{
				headers: {
					'Set-Cookie': await commitSession(session),
				},
			},
		)
	}

	// Return default values.
	// Subscription existence has not been able to be verified.
	return json<LoaderData>(
		{
			hasSkippedSubscriptionCheck: true,
			hasSuccessfullySubscribed: false,
		},
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		},
	)
}

export default function CheckoutRoute() {
	const { hasSkippedSubscriptionCheck, hasSuccessfullySubscribed } =
		useLoaderData<typeof loader>()
	const submit = useSubmit()

	// This effect will allow Stripe Webhook to update our database,
	// giving it a few seconds to accomplish it.
	useEffect(() => {
		if (hasSkippedSubscriptionCheck === false)
			// Feel free to update the seconds a user will have to wait,
			// until we do the Subscription validation.
			setTimeout(() => submit(null, { method: 'get' }), 8000)
	}, [hasSkippedSubscriptionCheck, submit])

	return (
		<div className="flex h-full w-full flex-col items-center justify-center px-6">
			{!hasSkippedSubscriptionCheck && (
				<div className="flex flex-col items-center">
					<svg
						className="h-16 w-16 animate-spin fill-gray-600 transition hover:scale-110
						hover:fill-gray-900 active:scale-100 dark:fill-gray-400 dark:hover:fill-gray-100"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24">
						<path d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536 1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071 3.536-3.535 1.414 1.415-3.536 3.535z" />
					</svg>
					<div className="mb-6" />

					<h5 className="text-left text-3xl font-bold text-gray-800 dark:text-gray-100">
						{!hasSkippedSubscriptionCheck && 'Completing your checkout ... '}
					</h5>
				</div>
			)}

			{hasSkippedSubscriptionCheck && hasSuccessfullySubscribed === false && (
				<div className="flex max-w-lg flex-col items-center">
					<svg
						className="h-16 w-16 fill-gray-600 transition hover:scale-110
						hover:fill-gray-900 active:scale-100 dark:fill-gray-400 dark:hover:fill-gray-100"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24">
						<path d="M20.995 6.9a.998.998 0 0 0-.548-.795l-8-4a1 1 0 0 0-.895 0l-8 4a1.002 1.002 0 0 0-.547.795c-.011.107-.961 10.767 8.589 15.014a.987.987 0 0 0 .812 0c9.55-4.247 8.6-14.906 8.589-15.014zM12 19.897C5.231 16.625 4.911 9.642 4.966 7.635L12 4.118l7.029 3.515c.037 1.989-.328 9.018-7.029 12.264z" />
						<path d="m11 12.586-2.293-2.293-1.414 1.414L11 15.414l5.707-5.707-1.414-1.414z" />
					</svg>
					<div className="mb-6" />

					<h5 className="text-left text-3xl font-bold text-gray-800 dark:text-gray-100">
						Whops!
					</h5>
					<div className="mb-3" />

					<p className="text-center text-base font-semibold text-gray-800 dark:text-gray-100">
						We was unable to verify your subscription.
						<br /> Please, contact us at: example@gmail.com and we will solve it
						for you!
					</p>
				</div>
			)}
		</div>
	)
}
