import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, useLoaderData } from '@remix-run/react'

import { authenticator } from '~/services/auth/config.server'
import { getSession, commitSession } from '~/services/auth/session.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const userSession = await authenticator.isAuthenticated(request, {
    successRedirect: '/account',
  })

  const session = await getSession(request.headers.get('Cookie'))
  const hasSentEmail = session.has('auth:otp')

  const email = session.get('auth:email') as string // Temporary force casting to string.
  const error = session.get(authenticator.sessionErrorKey)

  // Commit session, clearing any possible error.
  return json(
    { user: userSession, hasSentEmail, email, error },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  )
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.authenticate('OTP', request, {
    successRedirect: '/login/email',
    failureRedirect: '/login/email',
  })
}

export default function Login() {
  let { user, hasSentEmail, email, error } = useLoaderData<typeof loader>()

  return (
    <div className="flex w-full flex-col">
      {/* Headers. */}
      <div className="flex w-full flex-col items-center">
        <img
          src="https://raw.githubusercontent.com/dev-xo/dev-xo/main/assets/images/email.png"
          alt=""
          className="z-10 h-28 w-28 transform select-none transition hover:scale-110"
        />
        <div className="my-1" />

        <h5 className="text-center text-2xl font-semibold text-gray-200">
          Continue with Email
        </h5>
        <div className="my-1" />

        {/* Email confirmation. */}
        <p className="max-w-sm text-center font-semibold text-gray-400">
          {hasSentEmail ? (
            <span className="text-green-500">Email has been successfully sent.</span>
          ) : (
            <span>
              Type bellow your email, and we'll send you a <br /> One Time Password code.
            </span>
          )}
        </p>
        <div className="my-3" />
      </div>

      {/* Error messages. */}
      {error && (
        <>
          <strong className="text-center text-red-500">{error.message}</strong>
          <div className="my-3" />
        </>
      )}

      {/* Email Form. */}
      {!user && !hasSentEmail && (
        <>
          <Form method="post" autoComplete="off" className="w-full">
            <fieldset>
              <label className="font-semibold text-gray-200">
                <div>Email</div>
                <div className="my-1" />
                <input
                  type="email"
                  name="email"
                  placeholder="hello@remix.com"
                  className="h-12 w-full rounded-xl border-2 border-violet-500 bg-transparent px-6 
							    text-lg font-semibold text-gray-200 focus:border-violet-200"
                />
              </label>
            </fieldset>
            <div className="my-1" />

            <button
              type="submit"
              className="relative flex h-12 w-full flex-row items-center justify-center rounded-xl bg-violet-500
					    font-bold text-white transition hover:scale-105 active:scale-100 active:brightness-90">
              <svg
                className="absolute left-6 h-6 w-6 fill-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
              </svg>

              <span>Send Code</span>
            </button>
          </Form>
        </>
      )}

      {/* Verify Code Form. */}
      {hasSentEmail && (
        <div className="flex flex-col items-center">
          <Form method="post" autoComplete="off" className="w-full">
            <fieldset>
              <label className="font-semibold text-gray-200">
                <div>Code</div>
                <div className="my-1" />

                <input
                  type="text"
                  name="code"
                  placeholder="Paste here your code ..."
                  className="h-12 w-full rounded-xl border-2 border-violet-500 bg-transparent px-6 
							    text-lg font-semibold text-gray-200 focus:border-violet-200"
                />
              </label>
            </fieldset>
            <div className="my-1" />

            <button
              type="submit"
              className="relative flex h-12 w-full flex-row items-center justify-center rounded-xl bg-violet-500
					    font-bold text-white transition hover:scale-105 active:scale-100 active:brightness-90">
              <svg
                className="absolute left-6 h-6 w-6 fill-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.7-8 5.334L4 8.7V6.297l8 5.333 8-5.333V8.7z" />
              </svg>

              <span>Continue</span>
            </button>
          </Form>
          <div className="my-3" />

          {/* Request new Code Form. */}
          {/* Input should be hidden, email its already stored in Session. */}
          <Form method="post" autoComplete="off">
            <input type="hidden" name="email" defaultValue={email} />
            <button
              type="submit"
              className="relative flex w-auto flex-row items-center justify-center rounded-xl
					    font-bold text-violet-200 transition hover:scale-105 active:scale-100 active:brightness-90">
              <span>Request new Code</span>
            </button>
          </Form>
        </div>
      )}
    </div>
  )
}
