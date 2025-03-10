import { FullscreenSettings } from './fullscreen'
import { QueueSettings } from './queue'
import { ThemeSettingsPicker } from './theme'

export function Appearance() {
  return (
    <div className="space-y-4">
      <FullscreenSettings />
      <QueueSettings />
      <ThemeSettingsPicker />
    </div>
  )
}
