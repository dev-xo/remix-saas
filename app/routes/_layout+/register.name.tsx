import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'
import { useFetcher } from '@remix-run/react'

import { authenticator } from '~/services/auth/config.server'
import { getUserById } from '~/models/user/get-user'
import { updateUserById } from '~/models/user/update-user'

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  const user = await getUserById(session.id)
  if (!user) return redirect('/login')
  if (user.name) return redirect('/account')

  return json({})
}

export async function action({ request }: ActionFunctionArgs) {
  const session = await authenticator.isAuthenticated(request, {
    failureRedirect: '/login',
  })

  // Get form values.
  const { name } = Object.fromEntries(await request.formData())
  if (typeof name !== 'string') throw new Error('Name is required.')

  // Update user.
  await updateUserById(session.id, { name })

  return redirect('/account')
}

export default function RegisterName() {
  const fetcher = useFetcher()
  const isLoading = fetcher.state !== 'idle'

  return (
    <div className="flex w-full flex-col">
      {/* Headers. */}
      <div className="flex w-full flex-col items-center">
        <img
          src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/ole.png"
          alt=""
          className="z-10 h-28 w-28 transform select-none transition hover:scale-110"
        />
        <div className="my-1" />

        <h5 className="text-center text-2xl font-semibold text-gray-200">About you.</h5>
        <div className="my-1" />

        <p className="max-w-sm text-center font-semibold text-gray-400">
          Choose a name for your account.
          <br /> You can change it later.
        </p>
      </div>
      <div className="my-3" />

      {/* Name Form. */}
      <fetcher.Form method="post" autoComplete="off" className="w-full">
        <fieldset>
          <label className="font-semibold text-gray-200">
            <div>Name</div>
            <div className="my-1" />

            <input
              type="text"
              name="name"
              placeholder="John Doe"
              required
              className="h-12 w-full rounded-xl border-2 border-violet-500 bg-transparent px-6 
							text-lg font-semibold text-gray-200 focus:border-violet-200"
            />
          </label>
        </fieldset>
        <div className="my-1" />

        {!isLoading ? (
          <button
            type="submit"
            className="relative flex h-12 w-full flex-row items-center justify-center rounded-xl bg-violet-500
            font-bold text-white transition hover:scale-105 active:scale-100 active:brightness-90">
            <span>Continue</span>
          </button>
        ) : (
          <span className="relative flex cursor-default flex-row items-center justify-center font-semibold text-gray-200">
            <div className="my-8" />
            <svg
              className="absolute left-8 h-6 w-6 animate-spin fill-white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24">
              <path d="M2 11h5v2H2zm15 0h5v2h-5zm-6 6h2v5h-2zm0-15h2v5h-2zM4.222 5.636l1.414-1.414 3.536 3.536-1.414 1.414zm15.556 12.728-1.414 1.414-3.536-3.536 1.414-1.414zm-12.02-3.536 1.414 1.414-3.536 3.536-1.414-1.414zm7.07-7.071 3.536-3.535 1.414 1.415-3.536 3.535z" />
            </svg>
            <div className="mx-1" />
            Setting up your account
          </span>
        )}
      </fetcher.Form>
    </div>
  )
}
