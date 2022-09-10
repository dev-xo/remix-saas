import type { StripePlanInterface } from '../utils'
import { useFetcher } from '@remix-run/react'
import { STRIPE_PLANS } from '../utils'

type ComponentProps = {
	planId: StripePlanInterface['planId']
	purchasedPlanId: StripePlanInterface['planId']
}

export const UpdatePlanButton = ({
	planId,
	purchasedPlanId,
}: ComponentProps) => {
	const fetcher = useFetcher()
	const isLoading = fetcher.state !== 'idle'

	const planIdName = STRIPE_PLANS.find(
		(plan) => plan.planId === planId,
	)?.planName

	const planIdPriceAmount = STRIPE_PLANS.find(
		(plan) => plan.planId === planId,
	)?.planPriceAmount

	const purchasedPlanPriceAmount = STRIPE_PLANS.find(
		(plan) => plan.planId === purchasedPlanId,
	)?.planPriceAmount

	const buttonBackgroundClassName = () => {
		switch (planIdName) {
			case 'Basic':
				return 'bg-green-700 hover:bg-green-500'
			case 'Creative':
				return 'bg-sky-700 hover:bg-sky-500'
			case 'PRO':
				return 'bg-purple-700 hover:bg-purple-500'
		}
	}

	/**
	 * Compares current Subscription plan price amount,
	 * with provided `planId` price amount.
	 */
	if (planIdPriceAmount && purchasedPlanPriceAmount) {
		if (planIdPriceAmount === purchasedPlanPriceAmount) {
			return (
				<button
					className={`${buttonBackgroundClassName()} flex h-9 flex-row items-center justify-center rounded-xl
					px-12 text-base font-bold text-white transition hover:scale-105 active:scale-100`}>
					<span>Curent Plan</span>
				</button>
			)
		}

		/**
		 * As button value, we'll send newly desired planId.
		 */
		return (
			<fetcher.Form
				action="/resources/stripe/update-subscription-plan"
				method="post">
				<button
					name="newPlanId"
					value={planId}
					className={`${buttonBackgroundClassName()} flex h-9 flex-row items-center justify-center rounded-xl
					px-12 text-base font-bold text-white opacity-50 transition hover:scale-105 hover:opacity-100 active:scale-100`}>
					<span>
						{isLoading
							? 'Updating ...'
							: `${
									planIdPriceAmount <= purchasedPlanPriceAmount
										? 'Downgrade'
										: 'Upgrade'
							  } to ${planIdName}`}
					</span>
				</button>
			</fetcher.Form>
		)
	}

	return null
}
