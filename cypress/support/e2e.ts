import '@testing-library/cypress/add-commands'
import './commands'

// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

Cypress.on('uncaught:exception', (err) => {
	// Cypress and React Hydrating the document don't get along for some unknown reason.
	// Hopefully we figure out why eventually so we can remove this.
	if (
		/hydrat/i.test(err.message) ||
		/Minified React error #418/.test(err.message) ||
		/Minified React error #423/.test(err.message)
	) {
		return false
	}
})
