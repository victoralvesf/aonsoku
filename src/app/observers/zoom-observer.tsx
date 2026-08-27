import { useEffect } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAppStore } from '@/store/app.store'
import { isDesktop } from '@/utils/desktop'
import { nextZoomLevel } from '@/utils/zoom'
import type { ZoomAction } from '../../../electron/preload/types'

function changeZoom(action: ZoomAction) {
  const { zoomLevel, setZoomLevel } = useAppStore.getState().accessibility

  setZoomLevel(nextZoomLevel(zoomLevel, action))
}

const hotkeysOptions = {
  enabled: !isDesktop(),
  enableOnFormTags: true,
  preventDefault: true,
}

export function ZoomObserver() {
  useHotkeys(
    ['mod+equal', 'mod+shift+equal', 'mod+add'],
    () => changeZoom('in'),
    hotkeysOptions,
  )
  useHotkeys(
    ['mod+minus', 'mod+subtract'],
    () => changeZoom('out'),
    hotkeysOptions,
  )
  useHotkeys('mod+0', () => changeZoom('reset'), hotkeysOptions)

  useEffect(() => {
    if (!isDesktop()) return

    window.api.zoomActionListener(changeZoom)

    return () => window.api.removeZoomActionListener()
  }, [])

  return null
}
