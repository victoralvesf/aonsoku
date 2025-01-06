import merge from 'lodash/merge'
import omit from 'lodash/omit'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { pingServer } from '@/api/pingServer'
import { AuthType, IAppContext, IServerConfig } from '@/types/serverConfig'
import {
  genEncodedPassword,
  genPassword,
  genPasswordToken,
  genUser,
  getAuthType,
  hasValidConfig,
} from '@/utils/salt'
import { queryServerInfo } from '@/api/queryServerInfo'

const { SERVER_URL, HIDE_SERVER } = window

export const useAppStore = createWithEqualityFn<IAppContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set, get) => ({
          data: {
            isServerConfigured: hasValidConfig,
            osType: '',
            url: SERVER_URL ?? '',
            username: genUser(),
            password: genPassword(),
            authType: getAuthType(),
            protocolVersion: "1.16.0",
            serverType: "subsonic",
            logoutDialogState: false,
            hideServer: HIDE_SERVER ?? false,
            lockUser: hasValidConfig,
            songCount: null,
            pages: {
              showInfoPanel: true,
            },
          },
          command: {
            open: false,
            setOpen: (value) => {
              set((state) => {
                state.command.open = value
              })
            },
          },
          update: {
            openDialog: false,
            setOpenDialog: (value) => {
              set((state) => {
                state.update.openDialog = value
              })
            },
            remindOnNextBoot: false,
            setRemindOnNextBoot: (value) => {
              set((state) => {
                state.update.remindOnNextBoot = value
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
              // try both token and password methods
              for (const authType of [AuthType.TOKEN, AuthType.PASSWORD]) {
                const token =
                  authType === AuthType.TOKEN
                    ? genPasswordToken(password)
                    : genEncodedPassword(password)

                const canConnect = await pingServer(
                  url,
                  username,
                  token,
                  authType,
                )

                const serverInfo = await queryServerInfo(url)

                if (canConnect) {
                  set((state) => {
                    state.data.url = url
                    state.data.username = username
                    state.data.password = token
                    state.data.authType = authType
                    state.data.protocolVersion = serverInfo.protocolVersion
                    state.data.serverType = serverInfo.serverType
                    state.data.isServerConfigured = true
                  })
                  return true
                }
              }
              set((state) => {
                state.data.isServerConfigured = false
              })
              return false
            },
            removeConfig: () => {
              set((state) => {
                state.data.isServerConfigured = false
                state.data.osType = ''
                state.data.url = ''
                state.data.username = ''
                state.data.password = ''
                state.data.protocolVersion = undefined
                state.data.serverType = undefined
                state.data.authType = AuthType.TOKEN
                state.data.songCount = null
              })
            },
            setLogoutDialogState: (value) => {
              set((state) => {
                state.data.logoutDialogState = value
              })
            },
            toggleShowInfoPanel: () => {
              const { showInfoPanel } = get().data.pages

              set((state) => {
                state.data.pages.showInfoPanel = !showInfoPanel
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
          const persisted = persistedState as Partial<IAppContext>

          if (hasValidConfig) {
            const newState = {
              ...persisted,
              data: {
                ...persisted.data,
                isServerConfigured: true,
                url: SERVER_URL as string,
                username: genUser(),
                password: genPassword(),
                authType: getAuthType(),
                hideServer: HIDE_SERVER ?? false,
                lockUser: true,
              },
            }

            return merge(currentState, newState)
          }

          const withoutLockUser = {
            ...persisted,
            data: {
              ...persisted.data,
              lockUser: false,
            },
          }

          return merge(currentState, withoutLockUser)
        },
        partialize: (state) => {
          const appStore = omit(
            state,
            'data.logoutDialogState',
            'data.hideServer',
            'command.open',
            'update',
          )

          return appStore
        },
      },
    ),
  ),
)

export const useAppData = () => useAppStore((state) => state.data)
export const useAppDataPages = () => useAppStore((state) => state.data.pages)
export const useAppActions = () => useAppStore((state) => state.actions)
export const useAppUpdate = () => useAppStore((state) => state.update)
