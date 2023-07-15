import type { Plan } from '@prisma/client'
import type { Interval } from '~/services/stripe/plans'

import { PlanId } from '~/services/stripe/plans'
import { useFetcher } from '@remix-run/react'

type CheckoutButtonProps = {
  currentPlanId: Plan['id'] | null
  planId: Plan['id']
  planName: Plan['name']
  planInterval: Interval | string
}

export function CheckoutButton({
  currentPlanId,
  planId,
  planName,
  planInterval,
}: CheckoutButtonProps) {
  const fetcher = useFetcher()
  const isLoading = fetcher.state !== 'idle'

  const buttonClassName = () => {
    switch (planId) {
      case PlanId.FREE:
        return 'bg-yellow-500 hover:bg-yellow-400'
      case PlanId.STARTER:
        return 'bg-green-500 hover:bg-green-400'
      case PlanId.PRO:
        return 'bg-violet-500 hover:bg-violet-400'
    }
  }

  if (planId === currentPlanId) {
    return (
      <button
        disabled
        className={`flex h-10 flex-row items-center justify-center rounded-xl px-6 
				font-bold text-gray-100 transition hover:scale-105 active:brightness-90 ${buttonClassName()}`}>
        <span>Current</span>
      </button>
    )
  }

  return (
    <fetcher.Form action="/resources/stripe/create-checkout" method="post">
      <button
        name="plan"
        value={JSON.stringify({ planId, planInterval })}
        disabled={currentPlanId !== PlanId.FREE}
        className={`flex h-10 flex-row items-center justify-center rounded-xl px-6 
				font-bold text-gray-100 transition hover:scale-105 active:brightness-90 ${buttonClassName()}`}>
        <span>{isLoading ? 'Redirecting ...' : `Get ${planName}`}</span>
      </button>
    </fetcher.Form>
  )
}
