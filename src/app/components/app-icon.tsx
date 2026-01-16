import { SVGProps } from 'react'
import { cn } from '@/lib/utils'

type AppIconProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export function AppIcon({ size = 48, className, ...props }: AppIconProps) {
  const strokeSize = 2

  return (
    <img
      src="/icon.svg"
      height="32"
      width="32"
    />
  )
}
