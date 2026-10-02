import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { shallow } from 'zustand/shallow'
import { createWithEqualityFn } from 'zustand/traditional'
import {
  WIDGET_DEFAULT_PORT,
  WIDGET_MAX_PROFILES,
  WidgetProfile,
  WidgetServerStatus,
  WidgetSettingsPayload,
} from '@/types/widget'
import { isDesktop } from '@/utils/desktop'
import { obsWidget } from '@/utils/obsWidget'

export interface IWidgetContext {
  data: WidgetSettingsPayload
  server: {
    status: WidgetServerStatus
  }
  actions: {
    setEnabled: (value: boolean) => void
    setPort: (value: number) => void
    addProfile: (name: string) => WidgetProfile | undefined
    updateProfile: (id: string, patch: Partial<WidgetProfile>) => void
    removeProfile: (id: string) => void
    setServerStatus: (status: WidgetServerStatus) => void
  }
}

function generateProfileId() {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)

  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0'))

  return hex.join('')
}

export function createWidgetProfile(name: string): WidgetProfile {
  return {
    id: generateProfileId(),
    name,
    theme: 'dark',
    compact: false,
    showCoverArt: true,
    showArtist: true,
    showAlbum: true,
    showProgressBar: true,
    idleBehavior: 'show-empty-state',
    transitionOnChange: true,
  }
}

export const useWidgetStore = createWithEqualityFn<IWidgetContext>()(
  subscribeWithSelector(
    persist(
      devtools(
        immer((set, get) => ({
          data: {
            enabled: false,
            port: WIDGET_DEFAULT_PORT,
            profiles: [],
          },
          server: {
            status: { status: 'stopped' },
          },
          actions: {
            setEnabled: (value) => {
              set((state) => {
                state.data.enabled = value
              })
            },
            setPort: (value) => {
              set((state) => {
                state.data.port = value
              })
            },
            addProfile: (name) => {
              const { profiles } = get().data
              if (profiles.length >= WIDGET_MAX_PROFILES) return undefined

              const profile = createWidgetProfile(name)

              set((state) => {
                state.data.profiles.push(profile)
              })

              return profile
            },
            updateProfile: (id, patch) => {
              set((state) => {
                const profile = state.data.profiles.find(
                  (item) => item.id === id,
                )
                if (!profile) return

                Object.assign(profile, patch)
              })
            },
            removeProfile: (id) => {
              set((state) => {
                state.data.profiles = state.data.profiles.filter(
                  (profile) => profile.id !== id,
                )
              })
            },
            setServerStatus: (status) => {
              set((state) => {
                state.server.status = status
              })
            },
          },
        })),
        {
          name: 'widget_store',
        },
      ),
      {
        name: 'widget_store',
        version: 1,
        // `server` is runtime-only: it reflects what the main process reports
        // right now and would be misleading if restored from a previous run.
        partialize: (state) => ({ data: state.data }),
      },
    ),
  ),
  shallow,
)

function syncSettingsToMain(data: WidgetSettingsPayload) {
  if (!isDesktop()) return

  window.api.saveWidgetSettings({
    enabled: data.enabled,
    port: data.port,
    profiles: data.profiles,
  })
}

useWidgetStore.subscribe((state) => state.data, syncSettingsToMain, {
  equalityFn: shallow,
})

useWidgetStore.subscribe(
  (state) => state.data.enabled,
  (enabled) => {
    if (enabled) obsWidget.sendCurrentSong()
  },
)

// The main process keeps no durable copy of these settings, so it needs the
// mirror as soon as the renderer boots — not only when the user edits them.
export function initWidgetSettingsSync() {
  if (!isDesktop()) return

  syncSettingsToMain(useWidgetStore.getState().data)

  window.api.widgetServerStatusListener((status) => {
    useWidgetStore.getState().actions.setServerStatus(status)
  })
}

export const useWidgetData = () => useWidgetStore((state) => state.data)
export const useWidgetActions = () => useWidgetStore((state) => state.actions)
export const useWidgetServerStatus = () =>
  useWidgetStore((state) => state.server.status)
export const useWidgetProfiles = () =>
  useWidgetStore((state) => state.data.profiles)
