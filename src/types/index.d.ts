export {}

declare global {
  interface Window {
    SERVER_URL: string | undefined
    HIDE_SERVER: boolean | undefined
    APP_USER: string | undefined
    APP_PASSWORD: string | undefined
    APP_AUTH_TYPE: string | undefined
    HIDE_RADIOS_SECTION: boolean | undefined
    SERVER_TYPE: string | undefined
  }
}
