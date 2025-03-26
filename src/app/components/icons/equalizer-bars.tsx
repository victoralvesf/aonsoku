import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type EqualizerBarsProps = ComponentPropsWithoutRef<'svg'> & {
  size?: number
}

const rects = [
  { x: 1, height: 14 },
  { x: 7, height: 20 },
  { x: 13, height: 18 },
  { x: 19, height: 12 },
]

export function EqualizerBars({
  size = 24,
  className,
  ...props
}: EqualizerBarsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      id="bars"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn('text-foreground', className)}
    >
      {rects.map((rect, index) => (
        <rect
          key={index}
          className={`eq-bar eq-bar--${index + 1}`}
          x={rect.x}
          y={0}
          width={4}
          height={rect.height}
          rx={0}
          fill="currentColor"
          shapeRendering="geometricPrecision"
        />
      ))}
    </svg>
  )
}
