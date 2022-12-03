import type { LoaderArgs } from '@remix-run/node'
import { db } from '~/lib/db'

/**
 * Learn more about Fly.io Healthcheck:
 * https://fly.io/docs/reference/configuration/#services-http_checks
 */
export async function loader({ request }: LoaderArgs) {
	const host = request.headers.get('X-Forwarded-Host') ?? request.headers.get('host')

	try {
		const url = new URL('/', `http://${host}`)
		await Promise.all([
			db.user.count(),

			fetch(url.toString(), { method: 'HEAD' }).then((res) => {
				if (!res.ok) return Promise.reject(res)
			}),
		])

		return new Response('OK')
	} catch (error: unknown) {
		console.log('Healthcheck Error:', { error })
		return new Response('Healthcheck Error.', { status: 500 })
	}
}

export default function HealthcheckResource() {
	return <div>Whops! You should have been redirected.</div>
}
