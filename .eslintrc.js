/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
	extends: [
		'@remix-run/eslint-config',
		'@remix-run/eslint-config/node',
		'@remix-run/eslint-config/jest-testing-library',
		'prettier',
	],
	env: {
		'cypress/globals': true,
	},
	plugins: ['cypress'],
	// We're using vitest which has a very similar API to jest
	// (so the linting plugins work nicely), but it means we have to explicitly
	// set the jest version.
	settings: {
		jest: {
			version: 28,
		},
	},
}
