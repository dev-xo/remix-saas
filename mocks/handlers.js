/**
 * Mocks handlers example.
 * https://github.com/mswjs/examples/blob/master/examples/rest-react/src/mocks/handlers.js
 */
const { rest } = require('msw')

const handlers = [
	rest.get('https://my-mock-api.com', (req, res, ctx) => {
		return res(
			ctx.status(200),
			ctx.json([
				{
					message: 'This is a mocked message example.',
				},
			]),
		)
	}),
]

module.exports = { handlers }
