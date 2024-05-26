import { FastAverageColor } from 'fast-average-color'

export async function getAverageColor(img: HTMLImageElement | null) {
  const fac = new FastAverageColor()

  return await fac.getColorAsync(img, {
    algorithm: 'dominant',
    ignoredColor: [
      [255, 255, 255, 255, 90], // White
      [0, 0, 0, 255, 30], // Black
      [0, 0, 0, 0, 40], // Transparent
    ],
    mode: 'precision',
  })
}