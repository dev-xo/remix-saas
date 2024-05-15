import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@remix-run/node'
import { useRef, useEffect } from 'react'
import { Form, useLoaderData } from '@remix-run/react'
import { json } from '@remix-run/node'
import { useHydrated } from 'remix-utils/use-hydrated'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { Loader2 } from 'lucide-react'
import { authenticator } from '#app/modules/auth/auth.server'
import { getSession, commitSession } from '#app/modules/auth/auth-session.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { checkHoneypot } from '#app/utils/honeypot.server'
import { useIsPending } from '#app/utils/misc'
import { siteConfig } from '#app/utils/constants/brand'
import { Input } from '#app/components/ui/input'
import { Button } from '#app/components/ui/button'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'
import { ROUTE_PATH as AUTH_VERIFY_PATH } from '#app/routes/auth+/verify'

export const ROUTE_PATH = '/auth/login' as const

export const LoginSchema = z.object({
  email: z.string().max(256).email('Email address is not valid.'),
})

export const meta: MetaFunction = () => {
  return [{ title: `${siteConfig.siteTitle} - Login` }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: DASHBOARD_PATH,
  })

  const cookie = await getSession(request.headers.get('Cookie'))
  const authEmail = cookie.get('auth:email')
  const authError = cookie.get(authenticator.sessionErrorKey)

  return json({ authEmail, authError } as const, {
    headers: {
      'Set-Cookie': await commitSession(cookie),
    },
  })
}

export async function action({ request }: ActionFunctionArgs) {
  const url = new URL(request.url)
  const pathname = url.pathname

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  await authenticator.authenticate('TOTP', request, {
    successRedirect: AUTH_VERIFY_PATH,
    failureRedirect: pathname,
  })
}

export default function Login() {
  const { authEmail, authError } = useLoaderData<typeof loader>()
  const inputRef = useRef<HTMLInputElement>(null)
  const isHydrated = useHydrated()
  const isPending = useIsPending()

  const [emailForm, { email }] = useForm({
    constraint: getZodConstraint(LoginSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginSchema })
    },
  })

  useEffect(() => {
    isHydrated && inputRef.current?.focus()
  }, [isHydrated])

  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <h3 className="text-center text-2xl font-medium text-primary">
          Continue to Remix SaaS
        </h3>
        <p className="text-center text-base font-normal text-primary/60">
          Welcome back! Please log in to continue.
        </p>
      </div>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(emailForm)}>
        {/* Security */}
        <AuthenticityTokenInput />
        <HoneypotInputs />

        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <Input
            placeholder="Email"
            ref={inputRef}
            defaultValue={authEmail ? authEmail : ''}
            className={`bg-transparent ${
              email.errors && 'border-destructive focus-visible:ring-destructive'
            }`}
            {...getInputProps(email, { type: 'email' })}
          />
        </div>

        <div className="flex flex-col">
          {!authError && email.errors && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {email.errors.join(' ')}
            </span>
          )}
          {!authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
        </div>

        <Button type="submit" className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : 'Continue with Email'}
        </Button>
      </Form>

      <div className="relative flex w-full items-center justify-center">
        <span className="absolute w-full border-b border-border" />
        <span className="z-10 bg-card px-2 text-xs font-medium uppercase text-primary/60">
          Or continue with
        </span>
      </div>

      <Form action={`/auth/github`} method="POST" className="w-full">
        <Button variant="outline" className="w-full gap-2 bg-transparent">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-primary/80 group-hover:text-primary"
            viewBox="0 0 24 24">
            <path
              fill="currentColor"
              fillRule="nonzero"
              d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
            />
          </svg>
          Github
        </Button>
      </Form>

      <p className="px-12 text-center text-sm font-normal leading-normal text-primary/60">
        By clicking continue, you agree to our{' '}
        <a href="/" className="underline hover:text-primary">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/" className="underline hover:text-primary">
          Privacy Policy.
        </a>
      </p>
    </div>
  )
}
