import * as SliderPrimitive from '@radix-ui/react-slider'
import { clsx } from 'clsx'
import * as React from 'react'

import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip'

type Variant = 'default' | 'secondary'

interface SliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  variant?: Variant
  thumbMouseDown?: React.MouseEventHandler<HTMLSpanElement>
  thumbMouseUp?: React.MouseEventHandler<HTMLSpanElement>
  tooltipValue?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, tooltipValue, variant = 'default', ...props }, ref) => {
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.button === 2) {
      event.preventDefault()
    }
  }

  const [showTooltip, setShowTooltip] = React.useState(false)

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-1.5 flex w-full touch-none select-none items-center cursor-pointer',
        className,
      )}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      {...props}
    >
      <SliderPrimitive.Track
        className={clsx(
          'relative h-1 w-full grow overflow-hidden rounded-full select-none',
          variant === 'default' && 'bg-secondary',
          variant === 'secondary' && 'bg-foreground/40',
        )}
      >
        <SliderPrimitive.Range
          className={clsx(
            'absolute h-full select-none',
            variant === 'default' && 'bg-primary',
            variant === 'secondary' && 'bg-secondary-foreground',
          )}
        />
      </SliderPrimitive.Track>

      <SliderTooltip
        open={showTooltip && tooltipValue !== undefined}
        variant={variant}
        content={tooltipValue ?? ''}
      >
        <SliderPrimitive.Thumb
          onPointerDown={props.thumbMouseDown}
          onPointerUp={props.thumbMouseUp}
          className={clsx(
            'block h-3 w-3 cursor-pointer select-none rounded-full',
            'border-2 ring-offset-background transition-colors',
            'focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:pointer-events-none disabled:opacity-50 transform-gpu',
            variant === 'default' && 'bg-primary border-primary',
            variant === 'secondary' &&
              'bg-secondary-foreground border-secondary-foreground',
          )}
          onKeyDown={(e) => e.preventDefault()}
        />
      </SliderTooltip>
    </SliderPrimitive.Root>
  )
})
Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }

interface SliderTooltipProps {
  open: boolean
  content: string
  children: React.ReactNode
  variant: Variant
}

function SliderTooltip({
  open,
  content,
  variant,
  children,
}: SliderTooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={clsx(
            'px-2 py-1',
            variant === 'default' && 'bg-background',
            variant === 'secondary' &&
              'bg-secondary-foreground border-muted-foreground/50 text-secondary font-semibold text-base',
          )}
          sticky="always"
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
