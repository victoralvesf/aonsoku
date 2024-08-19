import { MD5 } from 'crypto-js'
import merge from 'lodash/merge'
import omit from 'lodash/omit'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { pingServer } from '@/api/pingServer'
import { IAppContext, IServerConfig } from '@/types/serverConfig'
import { saltWord } from '@/utils/salt'

export const useAppStore = createWithEqualityFn<IAppContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set) => ({
          data: {
            isServerConfigured: false,
            osType: '',
            url: '',
            username: '',
            password: '',
            logoutDialogState: false,
          },
          command: {
            open: false,
            setOpen: (value) => {
              set((state) => {
                state.command.open = value
              })
            },
          },
          actions: {
            setOsType: (value) => {
              set((state) => {
                state.data.osType = value
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
            saveConfig: async ({ url, username, password }: IServerConfig) => {
              const token = MD5(`${password}${saltWord}`).toString()

              const canConnect = await pingServer(url, username, token)

              if (canConnect) {
                set((state) => {
                  state.data.url = url
                  state.data.username = username
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
