import { SettingsOptions } from '@/app/components/settings/options'

export enum AuthType {
  PASSWORD,
  TOKEN,
}

export interface IServerConfig {
  url: string
  username: string
  password: string
  protocolVersion?: string
  serverType?: string
}

export type PageViewType = 'grid' | 'table'

interface IAppPages {
  showInfoPanel: boolean
  toggleShowInfoPanel: () => void
  hideRadiosSection: boolean
  setHideRadiosSection: (value: boolean) => void
  artistsPageViewType: PageViewType
  setArtistsPageViewType: (type: PageViewType) => void
}

export interface IAppData extends IServerConfig {
  authType: AuthType | null
  isServerConfigured: boolean
  osType: string
  logoutDialogState: boolean
  hideServer: boolean
  lockUser: boolean
  songCount: number | null
}

export interface IAppActions {
  setOsType: (value: string) => void
  setUrl: (value: string) => void
  setUsername: (value: string) => void
  setPassword: (value: string) => void
  saveConfig: (data: IServerConfig) => Promise<boolean>
  removeConfig: () => void
  setLogoutDialogState: (value: boolean) => void
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

interface IPodcasts {
  active: boolean
  setActive: (value: boolean) => void
  serviceUrl: string
  setServiceUrl: (value: string) => void
  useDefaultUser: boolean
  setUseDefaultUser: (value: boolean) => void
  customUser: string
  setCustomUser: (value: string) => void
  customUrl: string
  setCustomUrl: (value: string) => void
}

export interface IAppContext {
  data: IAppData
  podcasts: IPodcasts
  pages: IAppPages
  command: IAppCommand
  actions: IAppActions
  update: IAppUpdate
  settings: IAppSettings
}
