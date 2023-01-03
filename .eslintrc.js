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

	// Using vitest requires to explicitly set jest version.
	settings: {
		jest: {
			version: 28,
		},
	},
}
