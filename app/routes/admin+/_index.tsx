import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { requireUserWithRole } from '#app/utils/permissions.server'

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUserWithRole(request, 'admin')
  return json({ user } as const)
}

export default function AdminIndex() {
  return (
    <div className="flex w-full flex-col gap-2 p-6 py-2">
      <h2 className="text-xl font-medium text-primary">Get Started</h2>
      <p className="text-sm font-normal text-primary/60">
        Explore the Admin Panel and get started with your first app.
      </p>
    </div>
  )
}
