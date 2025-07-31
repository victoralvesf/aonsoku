import { NativeImage, nativeImage, nativeTheme } from 'electron'
import { readFileSync } from 'fs'
import { join } from 'path'
import { NativeIconVariants } from './nativeIcons'
import { resourcesPath } from './taskbar'

const mediaIcons = {
  pause: 'pause',
  play: 'play',
  previous: 'skip_back',
  next: 'skip_forward',
  shuffle: 'shuffle',
  repeat: 'repeat',
  repeatOne: 'repeat_one',
}

function getMacOsMediaIconPath(
  icon: keyof typeof mediaIcons,
  size: number,
): string {
  const iconName = mediaIcons[icon]
  const fileName = `${iconName}_${size}x${size}.png`
  const themeFolder = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  return join(
    resourcesPath,
    'assets',
    'tray',
    'mac',
    'media',
    themeFolder,
    fileName,
  )
}

export function getMacOsMediaIcon(icon: keyof typeof mediaIcons): NativeImage {
  const image = nativeImage.createEmpty()

  for (const variant of NativeIconVariants) {
    const iconPath = getMacOsMediaIconPath(icon, variant.size)
    const buffer = readFileSync(iconPath)
    image.addRepresentation({
      buffer,
      width: variant.size,
      height: variant.size,
      scaleFactor: variant.scaleFactor,
    })
  }

  image.setTemplateImage(true)

  return image
}
