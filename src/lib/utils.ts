import { type ClassValue, clsx } from 'clsx'
import { withExtendedShadows } from 'tailwind-extended-shadows-merge'
import { extendTailwindMerge } from 'tailwind-merge'

export const twMerge = extendTailwindMerge(withExtendedShadows)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
