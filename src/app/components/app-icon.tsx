import { SVGProps } from 'react'
import { cn } from '@/lib/utils'

type AppIconProps = SVGProps<SVGSVGElement> & {
  size?: number
}

export function AppIcon({ size = 48, className, ...props }: AppIconProps) {
  const strokeSize = 2

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('fill-primary text-primary', className)}
      {...props}
    >
      <g>
        <rect width={48} height={48} rx={10} fill="currentColor" />
        <path
          d="M24 7.224c9.265 0 16.775 7.511 16.775 16.776S33.265 40.775 24 40.775c-9.265 0-16.776-7.51-16.776-16.775 0-9.265 7.511-16.775 16.776-16.776z"
          className="stroke-primary-foreground"
          strokeWidth={strokeSize}
        />
        <path
          d="M25.427 9.962c7.804 0 14.125 6.314 14.125 14.096s-6.321 14.097-14.125 14.097-14.125-6.315-14.125-14.097c0-7.782 6.322-14.096 14.125-14.096z"
          className="stroke-primary-foreground"
          strokeWidth={strokeSize}
        />
        <path
          d="M26.884 12.642c6.351 0 11.504 5.162 11.504 11.533 0 6.371-5.153 11.532-11.504 11.532-6.352 0-11.504-5.16-11.504-11.532 0-6.37 5.152-11.533 11.504-11.533z"
          className="stroke-primary-foreground"
          strokeWidth={strokeSize}
        />
        <path
          d="M28.34 15.205a8.883 8.883 0 11-.001 17.765 8.883 8.883 0 01.001-17.765z"
          className="stroke-primary-foreground"
          strokeWidth={strokeSize}
        />
      </g>
    </svg>
  )
}
