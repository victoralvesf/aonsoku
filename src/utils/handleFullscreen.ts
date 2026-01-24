import { enterFullscreen, exitFullscreen } from './browser'
import { isDesktop } from './desktop'
import { setDesktopTitleBarColors } from './theme'

export function handleFullscreen(
  open: boolean,
  autoFullscreenEnabled: boolean,
) {
  // We set title bar colors to transparent,
  // to not "unstyle" the big player appearance
  if (isDesktop()) setDesktopTitleBarColors(open)

  if (!autoFullscreenEnabled) return

  if (isDesktop()) {
    open ? window.api.enterFullScreen() : window.api.exitFullScreen()
    return
  }

  open ? enterFullscreen() : exitFullscreen()
}
