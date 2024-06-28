# Internationalization

Remix SaaS provides a simple way to translate your application into multiple languages.

This is achieved via `remix-i18next`, a library from [`@sergiodxa`](https://github.com/sergiodxa) that integrates `i18next` with Remix. You can learn more about `remix-i18next` by checking the Official Documentation:

- [Remix I18Next Documentation](https://github.com/sergiodxa/remix-i18next)

## How to use it?

Usage is as simple as it can be, as everything is already set up for you.

- Check `/modules/i18n` in order to customize the languages you want to support.
- Add/Edit the translations in the `locales` folder.
- Use the `useTranslation` hook in your components to translate your content.

## How to switch languages?

Remix SaaS provides a `LanguageSwitcher` Component that can be used to switch between languages.

- All this Component does is navigating to a `?lang=xx` query parameter, which will be used to set the language in the stored cookie.

## What is the default language?

The default language Remix SaaS uses is `en`. You can change this by editing the `fallbackLang` variable in the `i18n` configuration file.

## Contributing

If you have any suggestions or improvements, feel free to open an Issue or a Pull Request. Your contribution will be more than welcome!

- [Documentation](https://github.com/dev-xo/remix-saas/tree/main/docs#getting-started)
- [Live Demo](https://remix-saas.fly.dev)
- [Twitter Updates](https://twitter.com/DanielKanem)
