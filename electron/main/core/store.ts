import Store, { type Options } from 'electron-store'

export class AonsokuStore<
  // biome-ignore lint/suspicious/noExplicitAny: generic record
  T extends Record<string, any> = Record<string, unknown>,
> extends Store<T> {
  constructor(options: Omit<Options<T>, 'cwd'>) {
    super({ ...options, cwd: 'store' })
  }
}
