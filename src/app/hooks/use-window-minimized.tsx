import { useCallback, useEffect } from 'react'
import { useAppWindow } from '@/app/hooks/use-app-window'
import { useMinimizeToSystemTraySettings } from '@/store/player.store'
import { isTauri } from '@/utils/tauriTools'

export default function useWindowMinimized() {
  const { appWindow } = useAppWindow()
  const { minimizeToSystemTrayEnabled } = useMinimizeToSystemTraySettings()

  const updateIsWindowMaximized = useCallback(async () => {
    if (appWindow) {
      const isMinimized = await appWindow.isMinimized()
      if (isMinimized) {
        appWindow.hide()
      }
    }
  }, [appWindow])

  useEffect(() => {
    if (!minimizeToSystemTrayEnabled || !isTauri()) return

    let unlisten: () => void = () => {}

    const listen = async () => {
      if (appWindow) {
        unlisten = await appWindow.onResized(() => {
          updateIsWindowMaximized()
        })
      }
    }

    listen()

    return () => unlisten && unlisten()
  }, [appWindow, minimizeToSystemTrayEnabled, updateIsWindowMaximized])
}
