// Borrowed & modified from https://github.com/jenseng/abuse-the-platform/blob/main/app/utils/singleton.ts
// Thanks @jenseng!

export const singleton = <Value>(name: string, valueFactory: () => Value): Value => {
  const g = global as any
  g.__singletons ??= {}
  g.__singletons[name] ??= valueFactory()
  return g.__singletons[name]
}
