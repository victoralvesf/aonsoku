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
