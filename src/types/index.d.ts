export {}

declare global {
  interface Window {
    SERVER_URL: string | undefined
    HIDE_SERVER: boolean | undefined
  }
}
