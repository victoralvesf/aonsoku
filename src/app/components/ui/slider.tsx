import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'
import clsx from 'clsx'

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  showThumb?: boolean
  variant?: 'default' | 'secondary'
  thumbMouseDown?: React.MouseEventHandler<HTMLSpanElement>
  thumbMouseUp?: React.MouseEventHandler<HTMLSpanElement>
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, showThumb = true, variant = 'default', ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center',
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track
      className={clsx(
        'relative h-1 w-full grow overflow-hidden rounded-full',
        variant === 'default' && 'bg-secondary',
        variant === 'secondary' && 'bg-foreground/40',
      )}
    >
      <SliderPrimitive.Range
        className={clsx(
          'absolute h-full',
          variant === 'default' && 'bg-primary',
          variant === 'secondary' && 'bg-secondary-foreground',
        )}
      />
    </SliderPrimitive.Track>
    {showThumb && (
      <SliderPrimitive.Thumb
        onPointerDown={props.thumbMouseDown}
        onPointerUp={props.thumbMouseUp}
        className={clsx(
          'block h-3 w-3 cursor-pointer rounded-full border-2 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none transform-gpu disabled:opacity-50',
          variant === 'default' && 'bg-primary border-primary',
          variant === 'secondary' &&
            'bg-secondary-foreground border-secondary-foreground',
        )}
      />
    )}
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
