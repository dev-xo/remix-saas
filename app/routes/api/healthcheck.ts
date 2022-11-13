import type { LoaderArgs } from '@remix-run/node'
import { db } from '~/utils/db.server'

/**
 * Remix - Loader.
 *
 * Learn more about Fly.io Healthcheck:
 * https://fly.io/docs/reference/configuration/#services-http_checks
 */
export const loader = async ({ request }: LoaderArgs) => {
	const host =
		request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

	try {
		const url = new URL('/', `http://${host}`)
		await Promise.all([
			db.user.count(),

			fetch(url.toString(), { method: 'HEAD' }).then((r) => {
				if (!r.ok) return Promise.reject(r)
			}),
		])

		return new Response('OK')
	} catch (error: unknown) {
		console.log('Healthcheck Error:', { error })
		return new Response('Healthcheck Error.', { status: 500 })
	}
}
