import { SettingsOptions } from '@/app/components/settings/options'

export enum AuthType {
  PASSWORD,
  TOKEN,
}

export interface IServerConfig {
  url: string
  username: string
  password: string
}

interface IAppPages {
  showInfoPanel: boolean
}

export interface IAppData extends IServerConfig {
  authType: AuthType | null
  isServerConfigured: boolean
  osType: string
  logoutDialogState: boolean
  hideServer: boolean
  lockUser: boolean
  songCount: number | null
  pages: IAppPages
}

export interface IAppActions {
  setOsType: (value: string) => void
  setUrl: (value: string) => void
  setUsername: (value: string) => void
  setPassword: (value: string) => void
  saveConfig: (data: IServerConfig) => Promise<boolean>
  removeConfig: () => void
  setLogoutDialogState: (value: boolean) => void
  toggleShowInfoPanel: () => void
}

export interface IAppCommand {
  open: boolean
  setOpen: (value: boolean) => void
}

export interface IAppUpdate {
  openDialog: boolean
  setOpenDialog: (value: boolean) => void
  remindOnNextBoot: boolean
  setRemindOnNextBoot: (value: boolean) => void
}

interface IAppSettings {
  openDialog: boolean
  setOpenDialog: (value: boolean) => void
  currentPage: SettingsOptions
  setCurrentPage: (page: SettingsOptions) => void
}

export interface IAppContext {
  data: IAppData
  command: IAppCommand
  actions: IAppActions
  update: IAppUpdate
  settings: IAppSettings
}
