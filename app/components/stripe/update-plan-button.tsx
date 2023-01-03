import type { StripePlan } from '~/services/stripe/plans'
import { getStripePlanValue } from '~/services/stripe/plans'
import { useFetcher } from '@remix-run/react'

interface PlanButtonProps {
	planId: StripePlan['planId']
	purchasedPlanId: StripePlan['planId']
}

export function UpdatePlanButton({ planId, purchasedPlanId }: PlanButtonProps) {
	const fetcher = useFetcher()
	const isLoading = fetcher.state !== 'idle'

	const stripePlanName = getStripePlanValue({ planId, value: 'planName' })
	const stripePlanPriceAmount = getStripePlanValue({
		planId,
		value: 'planPriceAmount',
	})
	const purchasedPlanPriceAmount = getStripePlanValue({
		planId: purchasedPlanId,
		value: 'planPriceAmount',
	})

	const buttonClassName = () => {
		switch (stripePlanName) {
			case 'Basic':
				return 'bg-yellow-700 hover:bg-yellow-400'
			case 'Creative':
				return 'bg-green-700 hover:bg-green-400'
			case 'PRO':
				return 'bg-violet-700 hover:bg-violet-400'
		}
	}

	if (!stripePlanName || !stripePlanPriceAmount || !purchasedPlanPriceAmount)
		return null

	// Returns current plan button.
	if (stripePlanPriceAmount === purchasedPlanPriceAmount) {
		return (
			<button
				disabled={true}
				className={`flex h-10 flex-row items-center justify-center rounded-xl px-6 
				font-bold text-gray-100 ${buttonClassName()}`}>
				<span>Current</span>
			</button>
		)
	}

	// As button `value`, we'll provide newly desired `planId`.
	return (
		<fetcher.Form action="/resources/stripe/update-subscription-plan" method="post">
			<button
				name="newPlanId"
				value={planId}
				className={`flex h-10 flex-row items-center justify-center rounded-xl px-6 
				font-bold text-gray-100 transition hover:scale-105 active:brightness-90 ${buttonClassName()}`}>
				<span>
					{isLoading
						? 'Updating ...'
						: `${
								stripePlanPriceAmount <= purchasedPlanPriceAmount
									? 'Downgrade'
									: 'Upgrade'
						  } to ${stripePlanName}`}
				</span>
			</button>
		</fetcher.Form>
	)
}
