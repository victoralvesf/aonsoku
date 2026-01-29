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
    APP_THEME: string | undefined
    APP_HIDE_THEMES: boolean | undefined
    IMAGE_CACHE_ENABLED: boolean | undefined
    DISABLE_IMAGE_CACHE_TOGGLE: boolean | undefined
    DISABLE_DOWNLOADS: boolean | undefined
    DISABLE_LRCLIB: boolean | undefined
  }
}
