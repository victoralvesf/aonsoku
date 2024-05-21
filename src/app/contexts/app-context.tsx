import { ReactNode, createContext, useEffect, useState } from "react"
import { Store } from "tauri-plugin-store-api";
import MD5 from 'crypto-js/md5'
import { toast } from 'react-toastify'
import { IAppContext, IServerConfig } from "@/types/serverConfig";
import { pingServer } from "@/api/pingServer";
import { removeFromLocalStorage, saveToLocalStorage } from "@/utils/persistDataLayer";

const store = new Store(".settings.dat");

const AppContext = createContext({} as IAppContext)

export function AppContextProvider({ children }: { children: ReactNode }) {
  const saltWord = '5ub50n1cPl4y3r'

  const [isServerConfigured, setIsServerConfigured] = useState(false)
  const [serverProtocol, setServerProtocol] = useState('http://')
  const [serverUrl, setServerUrl] = useState('')
  const [serverUsername, setServerUsername] = useState('')
  const [serverPassword, setServerPassword] = useState('')

  async function getServerConfig() {
    const serverConfig = await store.get<IServerConfig>("server-config")

    if (serverConfig) {
      setServerUrl(serverConfig.url)
      setServerUsername(serverConfig.username)
      setServerPassword(serverConfig.password)
      setIsServerConfigured(true)

      saveToLocalStorage({
        url: serverConfig.url,
        username: serverConfig.username,
        token: serverConfig.password,
        salt: saltWord
      })
      console.log(serverConfig)
    } else {
      setIsServerConfigured(false)
      console.log('No server configuration');
    }
  }

  useEffect(() => {
    getServerConfig();
  }, [])

  async function handleSaveServerConfig() {
    const token = MD5(`${serverPassword}${saltWord}`).toString()
    const fullUrl = `${serverProtocol}${serverUrl}`

    const canConnect = await pingServer(fullUrl, serverUsername, token, saltWord)

    if (canConnect) {
      const config = {
        url: fullUrl,
        username: serverUsername,
        password: token
      }
      await store.set("server-config", config)
      await store.save()

      saveToLocalStorage({
        url: config.url,
        username: config.username,
        token,
        salt: saltWord
      })

      setServerUrl(fullUrl)
      setServerPassword(token)
      setIsServerConfigured(true)

      toast.success('Server configuration saved successfully!')
    } else {
      setIsServerConfigured(false)
      toast.error('Server communication failed!')
    }
  }

  async function handleRemoveServerConfig() {
    removeFromLocalStorage()
    await store.delete("server-config")
    await store.save()
    setIsServerConfigured(false)
  }

  const providerProps: IAppContext = {
    isServerConfigured,
    serverProtocol,
    setServerProtocol,
    serverUrl,
    setServerUrl,
    serverUsername,
    setServerUsername,
    serverPassword,
    setServerPassword,
    handleSaveServerConfig,
    handleRemoveServerConfig
  }

  return (
    <AppContext.Provider value={providerProps}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext