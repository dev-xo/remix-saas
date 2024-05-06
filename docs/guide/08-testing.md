# Testing

Remix SaaS provides a ultra simple testing setup, based on `vitest`.

The testing setup is designed to be as simple as possible, while still providing a good amount of flexibility. This design choice was made in order to allow developers to choose their own testing setup, while still providing a good starting point.

## Running tests

To run tests, simply run the following command:

```bash
npm run test
```

This will run all tests in the `tests` directory.

## Writing tests

Tests are written in the `tests` directory. Each test file should be named `*.test.js` or `*.test.ts`.

Here is an example test file:

```typescript
import { test } from 'vitest'

test('1 + 1 = 2', () => {
  expect(1 + 1).toBe(2)
})
```

## Configuration

The testing setup can be found in the `vitest.config.js` file. This file allows you to configure the testing setup to your liking.

## Coverage

To generate a coverage report, run the following command:

```bash
npm run coverage
```

This will generate a coverage report in the `coverage` directory.

## Additional Resources

Database hooking and some other testing utilities has been skipped in this documentation, as the objective is to keep it as simple as possible. If you need a more advanced testing setup, please refer to the `vitest` documentation.

- [Vitest Documentation](https://vitest.dev/guide/)
- [Testing Library](https://testing-library.com/docs/)

## Contributing

If you have any suggestions or improvements, feel free to open an Issue or a Pull Request. Your contribution will be more than welcome!

- [Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started)
- [Live Demo](https://remix-saas.fly.dev)
- [Twitter Updates](https://twitter.com/DanielKanem)
