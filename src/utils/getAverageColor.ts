import { FastAverageColor } from 'fast-average-color'

export async function getAverageColor(img: HTMLImageElement | null) {
  const fac = new FastAverageColor()

  return await fac.getColorAsync(img, {
    mode: 'precision',
    algorithm: 'dominant',
    ignoredColor: [
      [255, 255, 255, 255, 90], // White
      [0, 0, 0, 255, 70], // Black
      [0, 0, 0, 0, 40], // Transparent
      [255, 255, 50, 255, 70], // Bright Yellow
      [100, 255, 10, 255, 50], // Bright Green
      [200, 20, 200, 255, 30], // Vibrant Purple
    ],
    // if the image only contains ignored colors, returns the primary color instead.
    defaultColor: [16, 183, 127, 1],
  })
}

export function hexToRgb(hex: string) {
  hex = hex.replace(/^#/, '')

  let red: number
  let green: number
  let blue: number

  if (hex.length === 3) {
    red = parseInt(hex[0] + hex[0], 16)
    green = parseInt(hex[1] + hex[1], 16)
    blue = parseInt(hex[2] + hex[2], 16)
  } else if (hex.length === 6) {
    red = parseInt(hex.substring(0, 2), 16)
    green = parseInt(hex.substring(2, 4), 16)
    blue = parseInt(hex.substring(4, 6), 16)
  } else {
    return undefined
  }

  return [red, green, blue]
}

export function hexToRgba(hex: string, alpha: number = 1) {
  const colors = hexToRgb(hex)
  if (!colors) return undefined

  const [r, g, b] = colors

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function hslToRbg(hsl: string) {
  const [h, s, l] = hsl.split(' ')

  const hue = parseInt(h)
  let saturation = parseInt(s.replace('%', ''))
  let lightness = parseInt(l.replace('%', ''))

  // Convert HSL to RGB
  saturation /= 100
  lightness /= 100

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation
  const secondComponent = chroma * (1 - Math.abs(((hue / 60) % 2) - 1))
  const matchLightness = lightness - chroma / 2

  let red: number
  let green: number
  let blue: number

  if (hue < 60) {
    red = chroma
    green = secondComponent
    blue = 0
  } else if (hue < 120) {
    red = secondComponent
    green = chroma
    blue = 0
  } else if (hue < 180) {
    red = 0
    green = chroma
    blue = secondComponent
  } else if (hue < 240) {
    red = 0
    green = secondComponent
    blue = chroma
  } else if (hue < 300) {
    red = secondComponent
    green = 0
    blue = chroma
  } else {
    red = chroma
    green = 0
    blue = secondComponent
  }

  red = (red + matchLightness) * 255
  green = (green + matchLightness) * 255
  blue = (blue + matchLightness) * 255

  return [red, green, blue]
}

function toHex(value: number) {
  const hex = Math.round(value).toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

export function hslToHex(hsl: string) {
  const [red, green, blue] = hslToRbg(hsl)

  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`
}

export function isDarkColor(hsl: string) {
  const [r, g, b] = hslToRbg(hsl)

  const luminance = 0.299 * r + 0.587 * g + 0.114 * b
  const isDark = luminance < 128

  return isDark
}

/**
 * Convert HSL values like "240 10% 3.9%" to "hsla(240, 10%, 3.9%, 1)".
 * @param hsl - The HSL string.
 * @param [alpha=1] - The alpha value (opacity), default is 1.
 */
export function hslToHsla(hsl: string, alpha = 1) {
  const hslBaseString = hsl.split(' ').join(', ')

  return `hsla(${hslBaseString}, ${alpha})`
}
