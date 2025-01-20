export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[logger] ${message}`, ...args)
    }
  },
  error: (message: string, ...args: unknown[]) => {
    console.error(`[logger] ${message}`, ...args)
  },
}
