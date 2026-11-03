import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@remix-run/node'
import { useRef, useEffect } from 'react'
import { Form, useLoaderData, data } from '@remix-run/react'
import { redirect } from '@remix-run/node'
import { useHydrated } from 'remix-utils/use-hydrated'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { getZodConstraint, parseWithZod } from '@conform-to/zod/v4'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import {
  isAuthenticated,
  authenticate,
  getAuthState,
} from '#app/modules/auth/auth.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { checkHoneypot } from '#app/utils/honeypot.server'
import { siteConfig } from '#app/utils/constants/brand'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { Input } from '#app/components/ui/input'
import { Button } from '#app/components/ui/button'

export const ROUTE_PATH = '/auth/verify' as const

export const VerifyLoginSchema = z.object({
  code: z.string().min(6, 'Code must be at least 6 characters.'),
})

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Verify` }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  await isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH,
  })

  const { authEmail, authError } = await getAuthState(request)

  if (!authEmail) return redirect('/auth/login')
  return data({
    authEmail,
    authError,
    githubEnabled: Boolean(
      process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET,
    ),
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  await authenticate('TOTP', request)
}

export default function Verify() {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const inputRef = useRef<HTMLInputElement>(null)
  const isHydrated = useHydrated()

  const [codeForm, { code }] = useForm({
    constraint: getZodConstraint(VerifyLoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: VerifyLoginSchema })
    },
  })

  useEffect(() => {
    if (isHydrated) inputRef.current?.focus()
  }, [isHydrated])

  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <p className="text-center text-2xl text-primary">Check your inbox!</p>
        <p className="text-center text-base font-normal text-primary/60">
          We&apos;ve just emailed you a temporary password.
          <br />
          Please enter it below.
        </p>
      </div>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(codeForm)}>
        <AuthenticityTokenInput />
        <HoneypotInputs />

        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="code" className="sr-only">
            Code
          </label>
          <Input
            placeholder="Code"
            ref={inputRef}
            required
            className={`bg-transparent ${
              code.errors && 'border-destructive focus-visible:ring-destructive'
            }`}
            {...getInputProps(code, { type: 'text' })}
          />
        </div>

        <div className="flex flex-col">
          {!authError && code.errors && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {code.errors.join(' ')}
            </span>
          )}
          {authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </Form>

      {/* Request New Code. */}
      {/* Email is already in session, input it's not required. */}
      <Form method="POST" className="flex w-full flex-col">
        <AuthenticityTokenInput />
        <HoneypotInputs />

        <p className="text-center text-sm font-normal text-primary/60">
          Did not receive the code?
        </p>
        <Button type="submit" variant="ghost" className="w-full hover:bg-transparent">
          Request New Code
        </Button>
      </Form>
    </div>
  )
}
