import { SVGProps } from 'react'

type AppIconProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export function AppIcon({ size = 48, className, ...props }: AppIconProps) {
  return (
    <img
      src="icon.svg"
      height="32"
      width="32"
      alt="pabm"
    />
  )
}
