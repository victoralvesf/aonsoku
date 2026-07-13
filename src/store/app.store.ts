import merge from 'lodash/merge'
import omit from 'lodash/omit'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'
import { pingServer } from '@/api/pingServer'
import { queryServerInfo } from '@/api/queryServerInfo'
import { AuthType, IAppContext, IServerConfig } from '@/types/serverConfig'
import { isDesktop } from '@/utils/desktop'
import { discordRpc } from '@/utils/discordRpc'
import { logger } from '@/utils/logger'
import {
  genEncodedPassword,
  genPassword,
  genPasswordToken,
  genUser,
  getAuthType,
  hasValidConfig,
} from '@/utils/salt'

const {
  SERVER_URL,
  HIDE_SERVER,
  HIDE_ARTISTS_SECTION,
  HIDE_SONGS_SECTION,
  HIDE_ALBUMS_SECTION,
  HIDE_GENRES_SECTION,
  HIDE_FAVORITES_SECTION,
  HIDE_PLAYLISTS_SECTION,
  HIDE_RADIOS_SECTION,
  SERVER_TYPE,
  IMAGE_CACHE_ENABLED,
} = window

const defaultArtworkServiceUrl = 'https://artwork.m8tec.top'

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
          accounts: {
            discord: {
              rpcEnabled: false,
              setRpcEnabled: (value) => {
                set((state) => {
                  state.accounts.discord.rpcEnabled = value
                })
              },
            },
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
            collapsibleState: false,
            setCollapsibleState: (value) => {
              set((state) => {
                state.podcasts.collapsibleState = value
              })
            },
          },
          artwork: {
            enabled: false,
            setEnabled: (value) => {
              set((state) => {
                state.artwork.enabled = value
              })
            },
            customUrlEnabled: false,
            setCustomUrlEnabled: (value) => {
              set((state) => {
                state.artwork.customUrlEnabled = value
              })
            },
            baseUrl: defaultArtworkServiceUrl,
            setBaseUrl: (value) => {
              set((state) => {
                state.artwork.baseUrl = value
              })
            },
            screens: {
              album: true,
              setAlbum: (value) => {
                set((state) => {
                  state.artwork.screens.album = value
                })
              },
              fullscreen: true,
              setFullscreen: (value) => {
                set((state) => {
                  state.artwork.screens.fullscreen = value
                })
              },
              playerBar: true,
              setPlayerBar: (value) => {
                set((state) => {
                  state.artwork.screens.playerBar = value
                })
              },
              drawer: true,
              setDrawer: (value) => {
                set((state) => {
                  state.artwork.screens.drawer = value
                })
              },
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
            hideArtistsSection: HIDE_ARTISTS_SECTION ?? false,
            setHideArtistsSection: (value) => {
              set((state) => {
                state.pages.hideArtistsSection = value
              })
            },
            hideSongsSection: HIDE_SONGS_SECTION ?? false,
            setHideSongsSection: (value) => {
              set((state) => {
                state.pages.hideSongsSection = value
              })
            },
            hideAlbumsSection: HIDE_ALBUMS_SECTION ?? false,
            setHideAlbumsSection: (value) => {
              set((state) => {
                state.pages.hideAlbumsSection = value
              })
            },
            hideGenresSection: HIDE_GENRES_SECTION ?? false,
            setHideGenresSection: (value) => {
              set((state) => {
                state.pages.hideGenresSection = value
              })
            },
            hideFavoritesSection: HIDE_FAVORITES_SECTION ?? false,
            setHideFavoritesSection: (value) => {
              set((state) => {
                state.pages.hideFavoritesSection = value
              })
            },
            hidePlaylistsSection: HIDE_PLAYLISTS_SECTION ?? false,
            setHidePlaylistsSection: (value) => {
              set((state) => {
                state.pages.hidePlaylistsSection = value
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
            imagesCacheLayerEnabled: IMAGE_CACHE_ENABLED ?? false,
            setImagesCacheLayerEnabled: (value) => {
              set((state) => {
                state.pages.imagesCacheLayerEnabled = value
              })
            },
            lyricsCacheEnabled: true,
            setLyricsCacheEnabled: (value) => {
              set((state) => {
                state.pages.lyricsCacheEnabled = value
              })
            },
            mediaCacheEnabled: true,
            setMediaCacheEnabled: (value) => {
              set((state) => {
                state.pages.mediaCacheEnabled = value
              })
            },
            isAllSectionsHidden: () => {
              const {
                hideArtistsSection,
                hideSongsSection,
                hideAlbumsSection,
                hideGenresSection,
                hideFavoritesSection,
                hidePlaylistsSection,
                hideRadiosSection,
              } = get().pages
              const { active: isPodcastsActive } = get().podcasts

              return (
                hideArtistsSection &&
                hideSongsSection &&
                hideAlbumsSection &&
                hideGenresSection &&
                hideFavoritesSection &&
                hidePlaylistsSection &&
                hideRadiosSection &&
                !isPodcastsActive
              )
            },
            homeAutoScrollEnabled: true,
            setHomeAutoScrollEnabled: (value) => {
              set((state) => {
                state.pages.homeAutoScrollEnabled = value
              })
            },
            homeLoopEnabled: true,
            setHomeLoopEnabled: (value) => {
              set((state) => {
                state.pages.homeLoopEnabled = value
              })
            },
          },
          desktop: {
            data: {
              minimizeToTray: false,
            },
            actions: {
              setMinimizeToTray: (value) => {
                set((state) => {
                  state.desktop.data.minimizeToTray = value
                })
              },
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
                    state.data.extensionsSupported =
                      serverInfo.extensionsSupported
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
                state.data.extensionsSupported = {}
                state.pages.showInfoPanel = true
                state.pages.hideArtistsSection = HIDE_ARTISTS_SECTION ?? false
                state.pages.hideSongsSection = HIDE_SONGS_SECTION ?? false
                state.pages.hideAlbumsSection = HIDE_ALBUMS_SECTION ?? false
                state.pages.hideFavoritesSection =
                  HIDE_FAVORITES_SECTION ?? false
                state.pages.hidePlaylistsSection =
                  HIDE_PLAYLISTS_SECTION ?? false
                state.pages.hideRadiosSection = HIDE_RADIOS_SECTION ?? false
                state.pages.artistsPageViewType = 'table'
                state.pages.homeAutoScrollEnabled = true
                state.pages.homeLoopEnabled = true
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

            let hideArtistsSection = false
            let hideSongsSection = false
            let hideAlbumsSection = false
            let hideFavoritesSection = false
            let hidePlaylistsSection = false
            let hideRadiosSection = false
            let enableImageCache = false
            let enableLyricsCache = true
            let enableMediaCache = true

            if (persisted && persisted.pages) {
              hideArtistsSection = persisted.pages.hideArtistsSection ?? false
              hideSongsSection = persisted.pages.hideSongsSection ?? false
              hideAlbumsSection = persisted.pages.hideAlbumsSection ?? false
              hideFavoritesSection =
                persisted.pages.hideFavoritesSection ?? false
              hidePlaylistsSection =
                persisted.pages.hidePlaylistsSection ?? false
              hideRadiosSection = persisted.pages.hideRadiosSection ?? false
              enableImageCache =
                persisted.pages.imagesCacheLayerEnabled ?? false
              enableLyricsCache = persisted.pages.lyricsCacheEnabled ?? true
              enableMediaCache = persisted.pages.mediaCacheEnabled ?? true
            }
            if (HIDE_ARTISTS_SECTION !== undefined) {
              hideArtistsSection = HIDE_ARTISTS_SECTION
            }
            if (HIDE_SONGS_SECTION !== undefined) {
              hideSongsSection = HIDE_SONGS_SECTION
            }
            if (HIDE_ALBUMS_SECTION !== undefined) {
              hideAlbumsSection = HIDE_ALBUMS_SECTION
            }
            if (HIDE_PLAYLISTS_SECTION !== undefined) {
              hidePlaylistsSection = HIDE_PLAYLISTS_SECTION
            }
            if (HIDE_FAVORITES_SECTION !== undefined) {
              hideFavoritesSection = HIDE_FAVORITES_SECTION
            }
            if (HIDE_RADIOS_SECTION !== undefined) {
              hideRadiosSection = HIDE_RADIOS_SECTION
            }
            if (IMAGE_CACHE_ENABLED !== undefined) {
              enableImageCache = IMAGE_CACHE_ENABLED
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
                  hidePlaylistsSection,
                  hideRadiosSection,
                  imagesCacheLayerEnabled: enableImageCache,
                  lyricsCacheEnabled: enableLyricsCache,
                  mediaCacheEnabled: enableMediaCache,
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
                hideArtistsSection,
                hideSongsSection,
                hideAlbumsSection,
                hideFavoritesSection,
                hidePlaylistsSection,
                hideRadiosSection,
                imagesCacheLayerEnabled: enableImageCache,
                lyricsCacheEnabled: enableLyricsCache,
                mediaCacheEnabled: enableMediaCache,
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

useAppStore.subscribe(
  (state) => state.accounts.discord.rpcEnabled,
  (currentState) => {
    if (currentState) {
      discordRpc.sendCurrentSong()
    } else {
      discordRpc.clear()
    }
  },
)

useAppStore.subscribe(
  (state) => state.desktop.data,
  (data) => {
    if (!isDesktop()) return

    window.api.saveAppSettings(data)
  },
  {
    equalityFn: shallow,
  },
)

export const useAppData = () => useAppStore((state) => state.data)
export const useAppAccounts = () => useAppStore((state) => state.accounts)
export const useAppPodcasts = () => useAppStore((state) => state.podcasts)
export const useAppAnimatedCovers = () => useAppStore((state) => state.artwork)
export const useAppPodcastCollapsibleState = () =>
  useAppStore((state) => ({
    collapsibleState: state.podcasts.collapsibleState,
    setCollapsibleState: state.podcasts.setCollapsibleState,
  }))
export const useAppPages = () => useAppStore((state) => state.pages)
export const useAppDesktopData = () =>
  useAppStore((state) => state.desktop.data)
export const useAppDesktopActions = () =>
  useAppStore((state) => state.desktop.actions)
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
export const useAppImagesCacheLayer = () =>
  useAppStore((state) => ({
    imagesCacheLayerEnabled: state.pages.imagesCacheLayerEnabled,
    setImagesCacheLayerEnabled: state.pages.setImagesCacheLayerEnabled,
  }))

export const useAppCaches = () =>
  useAppStore((state) => ({
    imagesCacheLayerEnabled: state.pages.imagesCacheLayerEnabled,
    setImagesCacheLayerEnabled: state.pages.setImagesCacheLayerEnabled,
    lyricsCacheEnabled: state.pages.lyricsCacheEnabled,
    setLyricsCacheEnabled: state.pages.setLyricsCacheEnabled,
    mediaCacheEnabled: state.pages.mediaCacheEnabled,
    setMediaCacheEnabled: state.pages.setMediaCacheEnabled,
  }))

export const useAppMediaCache = () =>
  useAppStore((state) => state.pages.mediaCacheEnabled)
