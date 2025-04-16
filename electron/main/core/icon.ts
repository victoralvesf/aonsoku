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

export function getAsset(name: string) {
  const asset = join(resourcesPath, 'assets', name)

  return nativeImage.createFromPath(asset)
}
