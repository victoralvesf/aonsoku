import { platform } from '@electron-toolkit/utils'
import { nativeImage } from 'electron'
import { join } from 'path'
import { resourcesPath } from './taskbar'

export function appIcon() {
  let icon = 'icon.png'

  if (platform.isWindows) icon = 'icon.ico'
  if (platform.isMacOS) icon = 'icon.icns'

  const iconImage = join(resourcesPath, 'icons', icon)

  return nativeImage.createFromPath(iconImage)
}

export function getAsset(name: string) {
  const asset = join(resourcesPath, 'assets', name)

  return nativeImage.createFromPath(asset)
}
