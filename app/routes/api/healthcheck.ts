import type { LoaderFunction } from '@remix-run/node'
import { db } from '~/utils'

/**
 * Remix - Loader.
 * @required Template code.
 *
 * Connects to database with the intent to make a simple query.
 * Also tries a HEAD request to our domain. On success, our app is healthy and running.
 * Learn more: https://fly.io/docs/reference/configuration/#services-http_checks
 */
export const loader: LoaderFunction = async ({ request }) => {
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
