import { ComponentPropsWithoutRef } from 'react'

type EqualizerBarsProps = ComponentPropsWithoutRef<'svg'>

const rects = [
  { x: 1, height: 12 },
  { x: 7, height: 18 },
  { x: 13, height: 16 },
  { x: 19, height: 10 },
]

export function EqualizerBars(props: EqualizerBarsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 24 24"
      className="text-foreground"
      id="bars"
      style={{ marginBottom: 4 }}
      {...props}
    >
      {rects.map((rect, index) => (
        <rect
          key={index}
          className={`eq-bar eq-bar--${index + 1}`}
          x={rect.x}
          y={2}
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
