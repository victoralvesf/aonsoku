import { nativeImage } from 'electron'
import { join } from 'path'

export function appIcon() {
  let icon = 'icon.png'

  if (process.platform === 'win32') icon = 'icon.ico'
  if (process.platform === 'darwin') icon = 'icon.icns'

  return nativeImage.createFromPath(join(__dirname, '../../build', icon))
}
