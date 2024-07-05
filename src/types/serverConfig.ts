export interface IServerConfig {
  url: string
  username: string
  password: string
}

export interface IAppData {
  isServerConfigured: boolean
  osType: string
  protocol: string
  url: string
  username: string
  password: string
}

export interface IAppActions {
  setOsType: (value: string) => void
  setProtocol: (value: string) => void
  setUrl: (value: string) => void
  setUsername: (value: string) => void
  setPassword: (value: string) => void
  saveConfig: () => Promise<boolean>
  removeConfig: () => void
}

export interface IAppContext {
  data: IAppData
  actions: IAppActions
}
