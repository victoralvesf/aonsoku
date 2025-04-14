import Store, { type Options } from 'electron-store'

export class AonsokuStore<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any> = Record<string, unknown>,
> extends Store<T> {
  constructor(options: Omit<Options<T>, 'cwd'>) {
    super({ ...options, cwd: 'store' })
  }
}
