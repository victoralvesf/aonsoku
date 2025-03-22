import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type IconProps = ComponentPropsWithoutRef<'svg'> & {
  volume: number
  size?: number
}

export function VolumeIcon({
  className,
  volume,
  size = 24,
  ...props
}: IconProps) {
  const higherThanHalf = volume >= 50
  const unmuted = volume > 0
  const muted = volume === 0

  const transition = 'opacity 300ms ease'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('lucide lucide-volume2', className)}
      {...props}
    >
      {/* Base */}
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>

      {/* Cross */}
      <path d="M22 9L16 15" style={{ transition, opacity: muted ? 1 : 0 }} />
      <path d="M16 9L22 15" style={{ transition, opacity: muted ? 1 : 0 }} />

      {/* Volume bar 1 */}
      <path
        d="M15.54 8.46a5 5 0 0 1 0 7.07"
        style={{ transition, opacity: unmuted ? 1 : 0 }}
      />

      {/* Volume bar 2 */}
      <path
        d="M19.07 4.93a10 10 0 0 1 0 14.14"
        style={{ transition, opacity: higherThanHalf ? 1 : 0 }}
      />
    </svg>
  )
}
