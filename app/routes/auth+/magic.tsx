import type { LoaderFunctionArgs } from '@remix-run/node'
import { authenticator } from '~/services/auth/config.server'

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.authenticate('OTP', request, {
    successRedirect: '/account',
    failureRedirect: '/login',
  })
}

export default function Screen() {
  return (
    <div className="flex h-screen flex-row items-center justify-center">
      Whops! You should have already been redirected.
    </div>
  )
}
