export enum AuthType {
  PASSWORD,
  TOKEN,
}

export interface IServerConfig {
  url: string
  username: string
  password: string
}

export interface IAppData extends IServerConfig {
  authType: AuthType | null
  isServerConfigured: boolean
  osType: string
  logoutDialogState: boolean
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

export interface IAppContext {
  data: IAppData
  command: IAppCommand
  actions: IAppActions
}
