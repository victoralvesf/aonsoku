import { nativeImage } from 'electron'
import { join } from 'path'
import { resourcesPath } from './taskbar'

export function appIcon() {
  let icon = 'icon.png'

  if (process.platform === 'win32') icon = 'icon.ico'
  if (process.platform === 'darwin') icon = 'icon.icns'

  const iconImage = join(resourcesPath, 'icons', icon)

  return nativeImage.createFromPath(iconImage)
}
