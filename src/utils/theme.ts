import { isDesktop } from './desktop'
import { hslToHex, hslToHsla } from './getAverageColor'

const DEFAULT_TITLE_BAR_COLOR = '#ff000000'
const DEFAULT_TITLE_BAR_SYMBOL = '#ffffff'

export function setDesktopTitleBarColors(transparent = false) {
  if (!isDesktop()) return

  let color = DEFAULT_TITLE_BAR_COLOR
  let symbol = DEFAULT_TITLE_BAR_SYMBOL

  const root = window.document.documentElement
  const styles = getComputedStyle(root)

  if (!transparent) {
    symbol = hslToHsla(styles.getPropertyValue('--foreground').trim())
    color = hslToHsla(styles.getPropertyValue('--background').trim())
  }

  const bgColor = hslToHex(styles.getPropertyValue('--background').trim())

  window.api.setTitleBarOverlayColors({
    color,
    symbol,
    bgColor,
  })
}
