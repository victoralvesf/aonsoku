import { os } from '@tauri-apps/api'
import MD5 from 'crypto-js/md5'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Store } from 'tauri-plugin-store-api'

import { pingServer } from '@/api/pingServer'
import { IAppContext, IServerConfig } from '@/types/serverConfig'
import {
  getFromLocalStorage,
  removeFromLocalStorage,
  saveToLocalStorage,
} from '@/utils/persistDataLayer'
import { saltWord } from '@/utils/salt'
import { isTauri } from '@/utils/tauriTools'

const store = new Store('.settings.dat')

const AppContext = createContext({} as IAppContext)

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [osType, setOsType] = useState('')
  const [isServerConfigured, setIsServerConfigured] = useState(false)
  const [serverProtocol, setServerProtocol] = useState('http://')
  const [serverUrl, setServerUrl] = useState('')
  const [serverUsername, setServerUsername] = useState('')
  const [serverPassword, setServerPassword] = useState('')

  const { t } = useTranslation()

  async function getServerConfig() {
    const serverConfig = await store.get<IServerConfig>('server-config')

    if (serverConfig) {
      setServerUrl(serverConfig.url)
      setServerUsername(serverConfig.username)
      setServerPassword(serverConfig.password)
      setIsServerConfigured(true)

      saveToLocalStorage({
        url: serverConfig.url,
        username: serverConfig.username,
        token: serverConfig.password,
      })
    } else {
      setIsServerConfigured(false)
    }
  }

  function getServerConfigBrowser() {
    const localConfig = getFromLocalStorage()
    if (localConfig.url && localConfig.username && localConfig.token) {
      setServerUrl(localConfig.url)
      setServerUsername(localConfig.username)
      setServerPassword(localConfig.token)
      setIsServerConfigured(true)
    } else {
      setIsServerConfigured(false)
    }
  }

  useEffect(() => {
    if (isTauri()) {
      getServerConfig()

      const getOsType = async () => {
        setOsType(await os.type())
      }
      getOsType()
    } else {
      getServerConfigBrowser()
    }
  }, [])

  async function handleSaveServerConfig() {
    const token = MD5(`${serverPassword}${saltWord}`).toString()
    const fullUrl = `${serverProtocol}${serverUrl}`

    const canConnect = await pingServer(fullUrl, serverUsername, token)

    if (canConnect) {
      const config = {
        url: fullUrl,
        username: serverUsername,
        password: token,
      }
      if (isTauri()) {
        await store.set('server-config', config)
        await store.save()
      }

      saveToLocalStorage({
        url: config.url,
        username: config.username,
        token,
      })

      setServerUrl(fullUrl)
      setServerPassword(token)
      setIsServerConfigured(true)

      toast.success(t('toast.server.success'))
      return true
    } else {
      setIsServerConfigured(false)
      toast.error(t('toast.server.error'))
      return false
    }
  }

  async function handleRemoveServerConfig() {
    removeFromLocalStorage()
    if (isTauri()) {
      await store.delete('server-config')
      await store.save()
    }
    setIsServerConfigured(false)
  }

  const providerProps: IAppContext = {
    isServerConfigured,
    osType,
    serverProtocol,
    setServerProtocol,
    serverUrl,
    setServerUrl,
    serverUsername,
    setServerUsername,
    serverPassword,
    setServerPassword,
    handleSaveServerConfig,
    handleRemoveServerConfig,
  }

  return (
    <AppContext.Provider value={providerProps}>{children}</AppContext.Provider>
  )
}

export const useApp = () => {
  return useContext(AppContext)
}
