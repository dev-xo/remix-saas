/**
 * Mocks handlers example.
 * https://github.com/mswjs/examples/blob/master/examples/rest-react/src/mocks/handlers.js
 */
/*  const { rest } = require('msw')

 const handlers = [
   rest.post('/login', (req, res, ctx) => {
     // Persist user's authentication in session.
     sessionStorage.setItem('is-authenticated', 'true')
 
     // Respond with a status 200 code.
     return res(ctx.status(200))
   }),
 
   rest.get('/user', (req, res, ctx) => {
     // Check if the user is authenticated in session.
     const isAuthenticated = sessionStorage.getItem('is-authenticated')
 
     if (!isAuthenticated) {
       // If not authenticated, respond with a 403 error.
       return res(
         ctx.status(403),
         ctx.json({
           errorMessage: 'Not authorized.',
         }),
       )
     }
 
     // If authenticated, return a mocked user details.
     return res(
       ctx.status(200),
       ctx.json({
         username: 'admin',
       }),
     )
   }),
 ]
 
 module.exports = { handlers } */
