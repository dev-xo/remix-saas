import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import { useState } from 'react'

import { authenticator } from '~/services/auth/config.server'
import { getSubscriptionByUserId } from '~/models/subscription/get-subscription'
import { getDefaultCurrency } from '~/utils/locales'

import { PlanId, Interval, Currency, PRICING_PLANS } from '~/services/stripe/plans'
import { CheckoutButton } from '~/components/stripe/checkout-button'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request)
  const subscription = session?.id ? await getSubscriptionByUserId(session.id) : null

  // Get client's currency.
  const defaultCurrency = getDefaultCurrency(request)

  return json({
    user: session,
    subscription,
    defaultCurrency,
  })
}

export default function Plans() {
  const { user, subscription, defaultCurrency } = useLoaderData<typeof loader>()
  const [planInterval, setPlanInterval] = useState<Interval | string>(
    subscription?.interval || Interval.MONTH,
  )

  return (
    <div className="flex w-full flex-col items-center justify-start px-6 md:h-full">
      {/* Header. */}
      <div className="flex flex-col items-center">
        <h3 className="text-3xl font-bold text-gray-200">Select your plan</h3>
        <div className="my-1" />
        <p className="text-center font-semibold text-gray-400">
          You can test the upgrade and won't be charged.
        </p>
      </div>
      <div className="my-1" />

      {/* Toggler. */}
      <div className="my-4 flex flex-col items-center justify-center">
        <div className="text-center font-bold text-gray-200">
          {planInterval === Interval.MONTH ? 'Monthly' : 'Yearly'}
        </div>
        <div className="my-2" />

        <label htmlFor="toggle" className="flex cursor-pointer items-center">
          <div className="relative">
            <input
              type="checkbox"
              id="toggle"
              value=""
              className="sr-only"
              checked={planInterval === Interval.YEAR}
              onChange={() =>
                setPlanInterval((prev) =>
                  prev === Interval.MONTH ? Interval.YEAR : Interval.MONTH,
                )
              }
            />
            <div className="block h-8 w-14 rounded-full bg-gray-600 opacity-40" />
            <div
              className={`dot absolute left-1 top-1 h-6 w-6 rounded-full  transition ${
                planInterval === Interval.MONTH
                  ? 'translate-x-0 bg-white'
                  : 'translate-x-6 bg-violet-400'
              }`}
            />
          </div>
        </label>
      </div>

      {/* Plans. */}
      <div className="flex w-full max-w-6xl flex-col items-center py-3 md:flex-row md:justify-center">
        {Object.values(PRICING_PLANS).map((plan) => {
          return (
            <div
              key={plan.id}
              className={`mx-2 flex min-w-[280px] flex-col items-center px-6 py-3 transition hover:opacity-100 ${
                user && subscription?.planId === plan.id ? 'opacity-100' : 'opacity-40'
              }`}>
              {/* Thumbnail. */}
              {plan.id === PlanId['FREE'] && (
                <img
                  src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
                  alt=""
                  className="h-24 w-24 select-none transition hover:scale-105 hover:brightness-110"
                />
              )}
              {plan.id === PlanId['STARTER'] && (
                <div className="relative">
                  <img
                    src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
                    alt=""
                    className="h-24 w-24 select-none hue-rotate-60 transition hover:scale-105 hover:brightness-110"
                  />
                  <img
                    src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
                    alt=""
                    className="absolute right-0 top-[-10px] h-8 w-8 select-none opacity-60 hue-rotate-60 transition hover:scale-105 hover:brightness-110"
                  />
                </div>
              )}

              {plan.id === PlanId['PRO'] && (
                <img
                  src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_2.png"
                  alt=""
                  className="h-24 w-24 select-none hue-rotate-[200deg] transition hover:scale-105 hover:brightness-110"
                />
              )}
              <div className="m-4" />

              {/* Name. */}
              <span className="text-2xl font-semibold text-gray-200">{plan.name}</span>
              <div className="my-3" />

              {/* Price Amount. */}
              <h5 className="flex flex-row items-center text-5xl font-bold text-gray-200">
                {defaultCurrency === Currency.EUR ? '€' : '$'}
                {planInterval === Interval.MONTH
                  ? plan.prices[Interval.MONTH][defaultCurrency] / 100
                  : plan.prices[Interval.YEAR][defaultCurrency] / 100}
                <small className="relative left-1 top-2 text-lg text-gray-400">
                  {planInterval === Interval.MONTH ? '/mo' : '/yr'}
                </small>
              </h5>
              <div className="my-3" />

              {/* Features. */}
              {plan.features.map((feature) => {
                return (
                  <div key={feature} className="flex flex-row items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="6 h-6 w-6 fill-gray-400"
                      viewBox="0 0 24 24">
                      <path d="m10 15.586-3.293-3.293-1.414 1.414L10 18.414l9.707-9.707-1.414-1.414z" />
                    </svg>
                    <div className="mx-1" />
                    <p className="flex flex-row whitespace-nowrap text-center text-base font-medium text-gray-400">
                      {feature}
                    </p>
                  </div>
                )
              })}
              <div className="my-3" />

              {/* Checkout Component. */}
              {user && (
                <CheckoutButton
                  currentPlanId={subscription?.planId ?? null}
                  planId={plan.id}
                  planName={plan.name}
                  planInterval={planInterval}
                />
              )}
            </div>
          )
        })}
      </div>

      {!user && (
        <Link to="/login" prefetch="intent">
          <button
            className="flex min-h-[40px] flex-row items-center justify-center rounded-xl bg-violet-500 px-6 
						  font-bold text-gray-100 transition hover:scale-105 active:brightness-90">
            Get Started
          </button>
        </Link>
      )}
    </div>
  )
}
