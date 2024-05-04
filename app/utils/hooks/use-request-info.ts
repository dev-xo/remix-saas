import type { loader as rootLoader } from '#app/root'
import { useRouteLoaderData } from '@remix-run/react'

/**
 * Returns the request info from the Root loader.
 */
export function useRequestInfo() {
  const data = useRouteLoaderData<typeof rootLoader>('root')
  if (!data?.requestInfo) throw new Error('No request info found in Root loader.')

  return data.requestInfo
}
