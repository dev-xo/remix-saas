import type { ClassValue } from 'clsx'
import { useFormAction, useNavigation } from '@remix-run/react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'

/**
 * Tailwind CSS classnames with support for conditional classes.
 * Widely used for Radix components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Shared by onboarding and profile settings. */
export const UsernameSchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .toLowerCase()
    .trim()
    .regex(/^[a-zA-Z0-9]+$/, 'Username may only contain alphanumeric characters.'),
})

/**
 * Permissions.
 * Implementation based on github.com/epicweb-dev/epic-stack
 */
export type RoleName = 'user' | 'admin'

export function userHasRole(
  user: { roles: Array<{ name: string }> } | null,
  role: RoleName,
) {
  if (!user) return false
  return user.roles.some((r) => r.name === role)
}

/**
 * Get the user's image src.
 */
export function getUserImgSrc(imageId?: string | null) {
  return imageId ? `/resources/user-images/${imageId}` : ''
}

/**
 * Use the current route's form action.
 * Checks if the current route's form is being submitted.
 *
 * @default formMethod is POST.
 * @default state is non-idle.
 */
export function useIsPending({
  formAction,
  formMethod = 'POST',
  state = 'non-idle',
}: {
  formAction?: string
  formMethod?: 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE'
  state?: 'submitting' | 'loading' | 'non-idle'
} = {}) {
  const contextualFormAction = useFormAction()
  const navigation = useNavigation()
  const isPendingState =
    state === 'non-idle' ? navigation.state !== 'idle' : navigation.state === state
  return (
    isPendingState &&
    navigation.formAction === (formAction ?? contextualFormAction) &&
    navigation.formMethod === formMethod
  )
}

/**
 * Returns a function that calls all of its arguments.
 */
export function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach((fn) => fn?.(...args))
}
