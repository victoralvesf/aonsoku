import merge from 'lodash/merge'
import omit from 'lodash/omit'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'
import { pingServer } from '@/api/pingServer'
import { queryServerInfo } from '@/api/queryServerInfo'
import { AuthType, IAppContext, IServerConfig } from '@/types/serverConfig'
import { logger } from '@/utils/logger'
import {
  genEncodedPassword,
  genPassword,
  genPasswordToken,
  genUser,
  getAuthType,
  hasValidConfig,
} from '@/utils/salt'

const { SERVER_URL, HIDE_SERVER, HIDE_RADIOS_SECTION, SERVER_TYPE } = window

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
            protocolVersion: '1.16.0',
            serverType: SERVER_TYPE ?? 'subsonic',
            logoutDialogState: false,
            hideServer: HIDE_SERVER ?? false,
            lockUser: hasValidConfig,
            songCount: null,
          },
          podcasts: {
            active: false,
            setActive: (value) => {
              set((state) => {
                state.podcasts.active = value
              })
            },
            serviceUrl: '',
            setServiceUrl: (value) => {
              set((state) => {
                state.podcasts.serviceUrl = value
              })
            },
            useDefaultUser: true,
            setUseDefaultUser: (value) => {
              set((state) => {
                state.podcasts.useDefaultUser = value
              })
            },
            customUser: '',
            setCustomUser: (value) => {
              set((state) => {
                state.podcasts.customUser = value
              })
            },
            customUrl: '',
            setCustomUrl: (value) => {
              set((state) => {
                state.podcasts.customUrl = value
              })
            },
          },
          pages: {
            showInfoPanel: true,
            toggleShowInfoPanel: () => {
              const { showInfoPanel } = get().pages

              set((state) => {
                state.pages.showInfoPanel = !showInfoPanel
              })
            },
            hideRadiosSection: HIDE_RADIOS_SECTION ?? false,
            setHideRadiosSection: (value) => {
              set((state) => {
                state.pages.hideRadiosSection = value
              })
            },
            artistsPageViewType: 'table',
            setArtistsPageViewType: (type) => {
              set((state) => {
                state.pages.artistsPageViewType = type
              })
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
          settings: {
            openDialog: false,
            setOpenDialog: (value) => {
              set((state) => {
                state.settings.openDialog = value
              })
            },
            currentPage: 'appearance',
            setCurrentPage: (page) => {
              set((state) => {
                state.settings.currentPage = page
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
                state.data.authType = AuthType.TOKEN
                state.data.protocolVersion = '1.16.0'
                state.data.serverType = 'subsonic'
                state.data.songCount = null
                state.pages.showInfoPanel = true
                state.pages.hideRadiosSection = HIDE_RADIOS_SECTION ?? false
                state.pages.artistsPageViewType = 'table'
                state.podcasts.active = false
                state.podcasts.serviceUrl = ''
                state.podcasts.useDefaultUser = true
                state.podcasts.customUser = ''
                state.podcasts.customUrl = ''
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
          try {
            const persisted = persistedState as Partial<IAppContext> | undefined

            let hideRadiosSection = false

            if (persisted) {
              hideRadiosSection = persisted.pages?.hideRadiosSection ?? false
            }
            if (HIDE_RADIOS_SECTION !== undefined) {
              hideRadiosSection = HIDE_RADIOS_SECTION
            }

            if (hasValidConfig) {
              const newState = {
                data: {
                  isServerConfigured: true,
                  url: SERVER_URL as string,
                  username: genUser(),
                  password: genPassword(),
                  authType: getAuthType(),
                  hideServer: HIDE_SERVER ?? false,
                  serverType: SERVER_TYPE ?? 'subsonic',
                  lockUser: true,
                },
                pages: {
                  hideRadiosSection,
                },
              }

              if (persistedState) {
                return merge(currentState, persistedState, newState)
              }

              return merge(currentState, newState)
            }

            const withoutLockUser = {
              data: {
                lockUser: false,
              },
              pages: {
                hideRadiosSection,
              },
            }

            if (persistedState) {
              return merge(currentState, persistedState, withoutLockUser)
            }

            return merge(currentState, withoutLockUser)
          } catch (error) {
            logger.error('[AppStore] [merge] - Unable to merge states', error)

            return currentState
          }
        },
        partialize: (state) => {
          const appStore = omit(
            state,
            'data.logoutDialogState',
            'data.hideServer',
            'command.open',
            'update',
            'settings',
          )

          return appStore
        },
      },
    ),
  ),
  shallow,
)

export const useAppData = () => useAppStore((state) => state.data)
export const useAppPodcasts = () => useAppStore((state) => state.podcasts)
export const useAppPages = () => useAppStore((state) => state.pages)
export const useAppActions = () => useAppStore((state) => state.actions)
export const useAppUpdate = () => useAppStore((state) => state.update)
export const useAppSettings = () => useAppStore((state) => state.settings)
export const useAppArtistsViewType = () =>
  useAppStore((state) => {
    const { artistsPageViewType, setArtistsPageViewType } = state.pages

    const isTableView = artistsPageViewType === 'table'
    const isGridView = artistsPageViewType === 'grid'

    return {
      artistsPageViewType,
      setArtistsPageViewType,
      isTableView,
      isGridView,
    }
  })
