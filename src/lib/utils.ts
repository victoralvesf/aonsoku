import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import { withExtendedShadows } from 'tailwind-extended-shadows-merge'

export const twMerge = extendTailwindMerge(withExtendedShadows)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
