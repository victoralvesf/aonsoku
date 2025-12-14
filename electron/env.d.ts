/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_DISCORD_CLIENT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
