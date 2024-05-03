import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from '@remix-run/node'
import { useRef, useEffect } from 'react'
import { Form, useActionData } from '@remix-run/react'
import { json, redirect } from '@remix-run/node'
import { useHydrated } from 'remix-utils/use-hydrated'
import { AuthenticityTokenInput } from 'remix-utils/csrf/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { Loader2 } from 'lucide-react'
import { requireSessionUser } from '#app/modules/auth/auth.server'
import {
  createCustomer,
  createFreeSubscription,
} from '#app/modules/stripe/queries.server'
import { prisma } from '#app/utils/db.server'
import { validateCSRF } from '#app/utils/csrf.server'
import { checkHoneypot } from '#app/utils/honeypot.server'
import { useIsPending } from '#app/utils/misc'
import { ERRORS } from '#app/utils/constants/errors'
import { ROUTE_PATH as LOGIN_PATH } from '#app/routes/auth+/login'
import { Input } from '#app/components/ui/input'
import { Button } from '#app/components/ui/button'
import { ROUTE_PATH as DASHBOARD_PATH } from '#app/routes/dashboard+/_layout'

export const ROUTE_PATH = '/onboarding/username' as const

export const UsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .toLowerCase()
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, 'Username may only contain alphanumeric characters.'),
})

export const meta: MetaFunction = () => {
  return [{ title: 'Remix SaaS - Username' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireSessionUser(request, { redirectTo: LOGIN_PATH })
  return json({})
}

export async function action({ request }: ActionFunctionArgs) {
  const sessionUser = await requireSessionUser(request, {
    redirectTo: LOGIN_PATH,
  })

  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()
  await validateCSRF(formData, clonedRequest.headers)
  checkHoneypot(formData)

  const submission = parseWithZod(formData, { schema: UsernameSchema })
  if (submission.status !== 'success') {
    return json(submission.reply(), { status: submission.status === 'error' ? 400 : 200 })
  }

  const { username } = submission.value
  const isUsernameTaken = await prisma.user.findUnique({ where: { username } })

  if (isUsernameTaken) {
    return json(
      submission.reply({
        fieldErrors: {
          username: [ERRORS.ONBOARDING_USERNAME_ALREADY_EXISTS],
        },
      }),
    )
  }
  await prisma.user.update({ where: { id: sessionUser.id }, data: { username } })
  await createCustomer({ userId: sessionUser.id })
  const subscription = await prisma.subscription.findUnique({
    where: { userId: sessionUser.id },
  })
  if (!subscription) await createFreeSubscription({ userId: sessionUser.id, request })

  return redirect(DASHBOARD_PATH)
}

export default function OnboardingUsername() {
  const lastResult = useActionData<typeof action>()
  const inputRef = useRef<HTMLInputElement>(null)
  const isHydrated = useHydrated()
  const isPending = useIsPending()

  const [form, { username }] = useForm({
    lastResult,
    constraint: getZodConstraint(UsernameSchema),
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: UsernameSchema })
    },
  })

  useEffect(() => {
    isHydrated && inputRef.current?.focus()
  }, [isHydrated])

  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <span className="mb-2 select-none text-6xl">👋</span>
        <h3 className="text-center text-2xl font-medium text-primary">Welcome!</h3>
        <p className="text-center text-base font-normal text-primary/60">
          Let's get started by choosing a username.
        </p>
      </div>

      <Form
        method="POST"
        autoComplete="off"
        className="flex w-full flex-col items-start gap-1"
        {...getFormProps(form)}>
        {/* Security */}
        <AuthenticityTokenInput />
        <HoneypotInputs />

        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="username" className="sr-only">
            Username
          </label>
          <Input
            placeholder="Username"
            autoComplete="off"
            ref={inputRef}
            required
            className={`bg-transparent ${
              username.errors && 'border-destructive focus-visible:ring-destructive'
            }`}
            {...getInputProps(username, { type: 'text' })}
          />
        </div>

        <div className="flex flex-col">
          {username.errors && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {username.errors.join(' ')}
            </span>
          )}
        </div>

        <Button type="submit" size="sm" className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : 'Continue'}
        </Button>
      </Form>

      <p className="px-6 text-center text-sm font-normal leading-normal text-primary/60">
        You can update your username at any time from your account settings.
      </p>
    </div>
  )
}
