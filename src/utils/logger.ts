import { isDev } from './env'

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.info(`[logger] ${message}`, ...args)
    }
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[logger] ${message}`, ...args)
  },
}
