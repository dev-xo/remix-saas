import type { LoaderFunction } from '@remix-run/node'
import { db } from '~/utils'

/**
 * Remix - Loader.
 * @protected Template code.
 *
 * If we can connect to database to make a simple query
 * and a HEAD request to ourselves, then we're good.
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
		console.log('Healthcheck ❌', { error })
		return new Response('ERROR', { status: 500 })
	}
}
