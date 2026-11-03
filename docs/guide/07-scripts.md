# Scripts

Remix SaaS comes with a few scripts that can help you manage your application. We opted for a simple setup, with a few scripts that cover the most common tasks. Scripts are defined in the `package.json` file, under the `scripts` key.

## Available Scripts

- `build`: Builds the application for production.
- `dev`: Starts the development server.
- `start`: Starts the production server.
- `lint`: Lints the application (ESLint).
- `typecheck`: Typechecks the application.
- `format`: Formats the application (Prettier).
- `setup`: Creates local environment, generates Prisma, initializes SQLite, and seeds demo data.
- `check`: Runs lint, type checks, tests, and production build.
- `test`: Runs tests once.
- `test:watch`: Runs tests in watch mode.
- `test:smoke`: Exercises the built app with a temporary database and local server.
- `test:coverage`: Generates a coverage report.

## How to run a script?

To run a script, simply run the following command:

```bash
npm run <script-name>
```

For example, to start the development server, run:

```bash
npm run dev
```

## Contributing

If you have any suggestions or improvements, feel free to open an Issue or a Pull Request. Your contribution will be more than welcome!

- [Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started)
- [Live Demo](https://remix-saas.fly.dev)
- [Twitter Updates](https://twitter.com/DanielKanem)
