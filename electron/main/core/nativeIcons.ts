import { screen } from 'electron'

export const NativeIconVariant = {
  Size16: { size: 16, scaleFactor: 1 },
  Size32: { size: 32, scaleFactor: 2 },
  Size48: { size: 48, scaleFactor: 3 },
  Size256: { size: 256, scaleFactor: 16 },
} as const

export const NativeIconVariants = Object.values(NativeIconVariant)

export function getDisplaysMaxScaleFactor(): number {
  const displays = screen.getAllDisplays()
  const scaleFactors = displays
    .map((display) => display.scaleFactor)
    .filter((scaleFactor) => Number.isFinite(scaleFactor) && scaleFactor > 1.0)
  return Math.max(1.0, ...scaleFactors)
}

export function getVariantForScaleFactor(scaleFactor: number) {
  const match = NativeIconVariants.find((variant) => {
    return variant.scaleFactor >= scaleFactor
  })

  return match ?? NativeIconVariant.Size32
}
