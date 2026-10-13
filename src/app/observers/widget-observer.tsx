import { useEffect } from 'react'
import { initWidgetSettingsSync } from '@/store/widget.store'

// The main process holds the widget settings in memory only, so it needs the
// renderer's persisted copy pushed to it once the app boots — and it reports
// the HTTP server status back through the same bridge.
export function WidgetObserver() {
  useEffect(() => {
    initWidgetSettingsSync()

    return () => {
      window.api.removeWidgetServerStatusListener()
    }
  }, [])

  return null
}
