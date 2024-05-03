# Utilities

Remix SaaS provides a number of utilities to help you manage your application with ease.

## Constants

Constants are a way to store values that are used throughout the application. They are defined in the `/utils/constants` directory. Some of the constants that are available are:

- Error Messages
- Action Intents

## Hooks

Hooks are a way to reuse logic across components. They are defined in the `/utils/hooks` directory. Some of the hooks that are available are:

- `useDoubleCheck`: A hook to confirm user actions, like deleting a record. (Original Source: [Epic Stack](github.com/epicweb-dev/epic-stack))
- `useInterval`: A hook to run a function at a specified interval.
- `useNonce`: A hook to generate a nonce value.
- `useRequestInfo`: A hook that returns the request information from the `root` loader.
- `useTheme`: A hook to manage the application theme.

## Permissions and Roles

Utils that help manage permissions and roles are defined in the `/utils/permissions` directory. Some of the utilities that are available are:

- `requireUserWithRole`: A utility to check if the user has the required role.

### Admin Role

You can authenticate as `admin` by using the following credentials:

- Email: `admin@admin.com`
- Code: OTP Code is provided by the terminal/console, as email is not sent to the `admin` user.

The default admin email can be changed in the `/prisma/seed.ts` file.

## Toasts

Toasts are a way to display messages to the user. They are defined in the `/utils/toasts` directory. Some of the toasts that are available are:

- `getToastSession`: A utility to get the toast session.
- `createToastHeaders`: A utility to create toast headers.
- `redirectWithToast`: A utility to redirect with a toast message.

There are a few more utilities available in the `/utils` directory. You can explore them to see how they can help you manage your application.

## Contributing

If you have any suggestions or improvements, feel free to open an Issue or a Pull Request. Your contribution will be more than welcome!

- [Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started)
- [Live Demo](https://remix-saas.fly.dev)
- [Twitter Updates](https://twitter.com/DanielKanem)
