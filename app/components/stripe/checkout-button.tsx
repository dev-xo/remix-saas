import type { StripePlan } from '~/services/stripe/plans'
import { useFetcher } from '@remix-run/react'

interface CheckoutButtonProps {
	planId: StripePlan['planId']
	planName: StripePlan['planName']
}

export function CheckoutButton({ planId, planName }: CheckoutButtonProps) {
	const fetcher = useFetcher()
	const isLoading = fetcher.state !== 'idle'

	const buttonClassName = () => {
		switch (planName) {
			case 'Basic':
				return 'bg-yellow-500 hover:bg-yellow-400'
			case 'Creative':
				return 'bg-green-500 hover:bg-green-400'
			case 'PRO':
				return 'bg-violet-500 hover:bg-violet-400'
		}
	}

	// As button `value`, we'll provide desired `planId` for Stripe Checkout.
	return (
		<fetcher.Form action="/resources/stripe/create-checkout-session" method="post">
			<button
				name="planId"
				value={planId}
				className={`flex h-10 flex-row items-center justify-center rounded-xl px-6 
				font-bold text-gray-100 transition hover:scale-105 active:brightness-90 ${buttonClassName()}`}>
				<span>{isLoading ? 'Redirecting ...' : `Get ${planName}`}</span>
			</button>
		</fetcher.Form>
	)
}
