import type { LoaderFunctionArgs } from '@remix-run/node'
import type { User, Subscription } from '@prisma/client'

import { json, redirect } from '@remix-run/node'
import { Form, Link, useLoaderData } from '@remix-run/react'
import { authenticator } from '~/services/auth/config.server'

import { PlanId, PRICING_PLANS } from '~/services/stripe/plans'
import { getSubscriptionByUserId } from '~/models/subscription/get-subscription'
import { getUserById } from '~/models/user/get-user'

import { formatUnixDate } from '~/utils/date'
import { CustomerPortalButton } from '~/components/stripe/customer-portal-button'

type LoaderData = {
  user: User
  subscription: Omit<Subscription, 'createdAt' | 'updatedAt'>
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const user = await getUserById(session.id)
  if (!user) return redirect('/login')

  const subscription = await getSubscriptionByUserId(user.id)

  // Redirect with the intent to setup user name.
  if (!user.name) return redirect('/register/name')

  // Redirect with the intent to setup user customer.
  if (!user.customerId) return redirect('/resources/stripe/create-customer')

  // Redirect with the intent to setup a free user subscription.
  if (!subscription) return redirect('/resources/stripe/create-subscription')

  return json<LoaderData>({ user, subscription })
}

export default function Account() {
  // Check bellow info about why we are force casting <LoaderData>
  // https://github.com/remix-run/remix/issues/3931
  const { user, subscription } = useLoaderData() as LoaderData

  // This is just for debugging purposes. (Feel free to remove it.)
  console.log(user)

  return (
    <div className="flex w-full flex-col items-center justify-start px-6 py-12 md:h-full">
      <div className="flex flex-col items-center">
        <h3 className="text-3xl font-bold text-gray-200">Dashboard</h3>
        <div className="my-1" />
        <p className="max-w-xs text-center font-semibold text-gray-400">
          Simple Dashboard example that includes User and Subscription.
        </p>
      </div>
      <div className="my-6" />

      <div className="flex w-full max-w-2xl flex-col items-center md:flex-row md:justify-evenly">
        {/* User. */}
        <div className="my-8 flex h-full w-full flex-col items-center md:my-0">
          {/* Avatar. */}
          <img
            src={`https://ui-avatars.com/api/?&name=${
              user.name ?? 'Remix'
            }&background=random`}
            alt="Avatar"
            className="h-36 w-36 select-none rounded-full transition hover:scale-105 hover:brightness-110"
          />
          <div className="my-3" />

          {/* Info. */}
          <div className="flex flex-col items-center">
            <h5 className="flex flex-row items-center text-center text-2xl font-bold text-gray-200">
              {user.name ? user.name : user.email}
              <div className="mr-1" />
              <svg
                className="h-7 w-7 fill-sky-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24">
                <path d="M19.965 8.521C19.988 8.347 20 8.173 20 8c0-2.379-2.143-4.288-4.521-3.965C14.786 2.802 13.466 2 12 2s-2.786.802-3.479 2.035C6.138 3.712 4 5.621 4 8c0 .173.012.347.035.521C2.802 9.215 2 10.535 2 12s.802 2.785 2.035 3.479A3.976 3.976 0 0 0 4 16c0 2.379 2.138 4.283 4.521 3.965C9.214 21.198 10.534 22 12 22s2.786-.802 3.479-2.035C17.857 20.283 20 18.379 20 16c0-.173-.012-.347-.035-.521C21.198 14.785 22 13.465 22 12s-.802-2.785-2.035-3.479zm-9.01 7.895-3.667-3.714 1.424-1.404 2.257 2.286 4.327-4.294 1.408 1.42-5.749 5.706z" />
              </svg>
            </h5>

            <span className="text-center text-lg font-semibold text-gray-400">
              My account
            </span>
          </div>
          <div className="my-3" />

          {/* Delete User Form Action. */}
          <Form method="post" action="/resources/user/delete">
            <button
              className="flex h-10 flex-row items-center rounded-xl border border-red-500 px-4 font-bold text-red-500 
              transition hover:scale-105 hover:brightness-200 active:opacity-80">
              Delete account
            </button>
          </Form>
        </div>

        {/* Subscription. */}
        <div className="flex h-full w-full flex-col items-center">
          {/* Images. */}
          <div className="flex flex-col items-center">
            {subscription.planId === PlanId.FREE && (
              <img
                src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
                alt=""
                className="h-36 w-36 select-none transition hover:scale-105 hover:brightness-110"
              />
            )}
            {subscription.planId === PlanId.STARTER && (
              <img
                src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_1.png"
                alt=""
                className="h-36 w-36 select-none hue-rotate-60 transition hover:scale-105 hover:brightness-110"
              />
            )}
            {subscription.planId === PlanId.PRO && (
              <img
                src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/star_2.png"
                alt=""
                className="h-36 w-36 select-none hue-rotate-[200deg] transition hover:scale-105 hover:brightness-110"
              />
            )}
          </div>
          <div className="my-3" />

          {/* Info. */}
          <div className="flex flex-col items-center">
            <h5 className="text-center text-2xl font-bold text-gray-200">
              {String(subscription.planId).charAt(0).toUpperCase() +
                subscription.planId.slice(1)}{' '}
              Plan
            </h5>

            <span className="text-center text-lg font-semibold text-gray-400">
              {subscription.planId === PlanId.FREE &&
                PRICING_PLANS[PlanId.FREE].description}

              {subscription.planId === PlanId.STARTER &&
                PRICING_PLANS[PlanId.STARTER].description}

              {subscription.planId === PlanId.PRO &&
                PRICING_PLANS[PlanId.PRO].description}
            </span>
          </div>
          <div className="my-3" />

          {/* Plans Link. */}
          {subscription.planId === PlanId.FREE && (
            <>
              <Link
                to="/plans"
                prefetch="intent"
                className="flex h-10 w-48 flex-row items-center justify-center rounded-xl bg-violet-500 px-6 
                font-bold text-gray-100 transition hover:scale-105 hover:brightness-125 active:opacity-80">
                <button>Subscribe</button>
              </Link>
              <div className="my-1" />
            </>
          )}

          {/* Customer Portal. */}
          {user.customerId && <CustomerPortalButton />}

          {/* Expire / Renew Date. */}
          {subscription.planId !== PlanId.FREE ? (
            <div className="max-w-[200px]">
              <div className="my-6" />
              <p className="text-center text-sm font-semibold text-gray-400">
                Your subscription{' '}
                {subscription.cancelAtPeriodEnd === true ? (
                  <span className="text-red-500">expires</span>
                ) : (
                  <span className="text-green-500">renews</span>
                )}{' '}
                on:{' '}
                <span className="text-gray-200">
                  {subscription && formatUnixDate(subscription.currentPeriodEnd)}
                </span>
              </p>
            </div>
          ) : (
            <div className="max-w-sm">
              <div className="my-6" />
              <p className="text-center text-sm font-semibold text-gray-400">
                Your Free Plan is unlimited.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
