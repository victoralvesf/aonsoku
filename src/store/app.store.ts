import { MD5 } from 'crypto-js'
import { merge, omit } from 'lodash'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { pingServer } from '@/api/pingServer'
import { IAppContext } from '@/types/serverConfig'
import { removeSlashFromUrl } from '@/utils/removeSlashFromUrl'
import { saltWord } from '@/utils/salt'

export const useAppStore = createWithEqualityFn<IAppContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set, get) => ({
          data: {
            isServerConfigured: false,
            osType: '',
            protocol: 'http://',
            url: '',
            username: '',
            password: '',
            logoutDialogState: false,
          },
          actions: {
            setOsType: (value) => {
              set((state) => {
                state.data.osType = value
              })
            },
            setProtocol: (value) => {
              set((state) => {
                state.data.protocol = value
              })
            },
            setUrl: (value) => {
              set((state) => {
                state.data.url = value
              })
            },
            setUsername: (value) => {
              set((state) => {
                state.data.username = value
              })
            },
            setPassword: (value) => {
              set((state) => {
                state.data.password = value
              })
            },
            saveConfig: async () => {
              const { username, password, protocol, url } = get().data
              const token = MD5(`${password}${saltWord}`).toString()
              const serverHost = removeSlashFromUrl(url)
              const fullUrl = `${protocol}${serverHost}`

              const canConnect = await pingServer(fullUrl, username, token)

              if (canConnect) {
                set((state) => {
                  state.data.url = fullUrl
                  state.data.password = token
                  state.data.isServerConfigured = true
                })

                return true
              } else {
                set((state) => {
                  state.data.isServerConfigured = false
                })
                return false
              }
            },
            removeConfig: () => {
              set((state) => {
                state.data.isServerConfigured = false
                state.data.osType = ''
                state.data.protocol = 'http://'
                state.data.url = ''
                state.data.username = ''
                state.data.password = ''
              })
            },
            setLogoutDialogState: (value) => {
              set((state) => {
                state.data.logoutDialogState = value
              })
            },
          },
        })),
        {
          name: 'app_store',
        },
      ),
      {
        name: 'app_store',
        version: 1,
        merge: (persistedState, currentState) => {
          return merge(currentState, persistedState)
        },
        partialize: (state) => {
          const appStore = omit(state, 'data.logoutDialogState')

          return appStore
        },
      },
    ),
  ),
)

export const useAppData = () => useAppStore((state) => state.data)
export const useAppActions = () => useAppStore((state) => state.actions)
