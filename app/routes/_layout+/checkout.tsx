import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect, json } from '@remix-run/node'
import { Link, useLoaderData, useSubmit } from '@remix-run/react'
import { useState } from 'react'

import { getSubscriptionByUserId } from '~/models/subscription/get-subscription'
import { authenticator } from '~/services/auth/config.server'
import { PlanId } from '~/services/stripe/plans'
import { useInterval } from '~/utils/hooks'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })
  const subscription = await getSubscriptionByUserId(session.id)

  // User is already subscribed.
  if (subscription?.planId !== PlanId.FREE) return redirect('/account')

  return json({
    pending: subscription?.planId === PlanId.FREE,
  })
}

export default function Checkout() {
  const { pending } = useLoaderData<typeof loader>()
  const [retries, setRetries] = useState(0)
  const submit = useSubmit()

  // Re-fetch subscription every 'x' seconds.
  useInterval(
    () => {
      submit(null)
      setRetries(retries + 1)
    },
    pending && retries !== 3 ? 2_000 : null,
  )

  return (
    <div className="m-auto flex h-full max-w-md flex-col items-center justify-center px-6">
      {/* Pending Message. */}
      {pending && retries < 3 && (
        <>
          <svg
            className="h-28 w-28 animate-spin fill-gray-400 hover:fill-violet-200"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536 1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071 3.536-3.535 1.414 1.415-3.536 3.535z" />
          </svg>
          <div className="my-3" />

          <h3 className="text-3xl font-bold text-gray-200">
            Completing your checkout ...
          </h3>
          <div className="my-1" />
          <p className="max-w-sm text-center font-semibold text-gray-400">
            This will take a few seconds.
          </p>
        </>
      )}

      {/* Success Message. */}
      {!pending && (
        <>
          <img
            src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/hundred.png"
            alt=""
            className="h-36 w-36 select-none transition hover:scale-105 hover:brightness-110"
          />
          <div className="my-3" />

          <h3 className="text-3xl font-bold text-gray-200">Checkout completed!</h3>
          <div className="my-1" />
          <p className="max-w-sm text-center font-semibold text-gray-400">
            Enjoy your new subscription plan!
          </p>
          <div className="my-3" />

          <Link
            to="/account"
            prefetch="intent"
            className="flex h-10 flex-row items-center rounded-xl bg-violet-500 px-6 
            font-bold text-gray-100 transition hover:scale-105 hover:brightness-125 active:opacity-80">
            Continue to Account
          </Link>
        </>
      )}

      {/* Error Message. */}
      {pending && retries === 3 && (
        <>
          <img
            src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/melt.png"
            alt=""
            className="h-36 w-36 select-none transition hover:scale-105 hover:brightness-110"
          />
          <div className="my-3" />

          <h3 className="text-3xl font-bold text-gray-200">Whops!</h3>
          <div className="my-1" />
          <p className="max-w-sm text-center font-semibold text-gray-400">
            Something went wrong. Please contact us directly and we will solve it for you.
          </p>
          <div className="my-3" />

          <Link
            to="/account"
            prefetch="intent"
            className="flex h-10 flex-row items-center rounded-xl bg-violet-500 px-6 
            font-bold text-gray-100 transition hover:scale-105 hover:brightness-125 active:opacity-80">
            Continue to Account
          </Link>
        </>
      )}
    </div>
  )
}
