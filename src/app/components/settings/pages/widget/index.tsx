import { WidgetProfiles } from './profiles'
import { WidgetServerSettings } from './server'

export function Widget() {
  return (
    <div className="space-y-4">
      <WidgetServerSettings />
      <WidgetProfiles />
    </div>
  )
}
