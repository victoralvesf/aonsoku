import { ColorSettings } from './colors'
import { FullscreenSettings } from './fullscreen'
import { ThemeSettingsPicker } from './theme'

export function Appearance() {
  return (
    <div className="space-y-4">
      <FullscreenSettings />
      <ColorSettings />
      <ThemeSettingsPicker />
    </div>
  )
}
