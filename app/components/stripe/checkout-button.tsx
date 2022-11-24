import type { StripePlan } from '~/services/stripe/plans'
import { useFetcher } from '@remix-run/react'

type ComponentProps = {
	planId: StripePlan['planId']
	planName: StripePlan['planName']
}

export const CheckoutButton = ({ planId, planName }: ComponentProps) => {
	const fetcher = useFetcher()
	const isLoading = fetcher.state !== 'idle'

	const buttonBackgroundClassName = () => {
		switch (planName) {
			case 'Basic':
				return 'bg-green-700 hover:bg-green-500'
			case 'Creative':
				return 'bg-sky-700 hover:bg-sky-500'
			case 'PRO':
				return 'bg-purple-700 hover:bg-purple-500'
		}
	}

	// As button `value`, we'll provide desired `planId` for Stripe Checkout.
	return (
		<fetcher.Form action="/stripe/create-checkout-session" method="post">
			<button
				name="planId"
				value={planId}
				className={`${buttonBackgroundClassName()} flex h-9 flex-row items-center justify-center rounded-xl
        px-12 text-base font-bold text-white transition hover:scale-105 active:scale-100`}>
				<span>{isLoading ? 'Redirecting ...' : `Get ${planName}`}</span>
			</button>
		</fetcher.Form>
	)
}
