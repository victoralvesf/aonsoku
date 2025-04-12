import { nativeImage } from 'electron'
import { join } from 'path'
import { cwd } from 'process'

export function appIcon() {
  let icon = 'icon.png'

  if (process.platform === 'win32') icon = 'icon.ico'
  if (process.platform === 'darwin') icon = 'icon.icns'

  return nativeImage.createFromPath(join(cwd(), 'build', icon))
}
