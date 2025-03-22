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

type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  variant?: Variant
  tooltipValue?: string
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, tooltipValue, variant = 'default', ...props }, ref) => {
  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const [showTooltip, setShowTooltip] = React.useState(false)

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-3 flex w-full touch-none select-none items-center cursor-pointer',
        className,
      )}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      {...props}
    >
      <SliderPrimitive.Track
        className={clsx(
          'relative h-1 w-full grow overflow-hidden rounded-full select-none',
          variant === 'default' && 'bg-secondary',
          variant === 'secondary' && 'bg-muted-foreground/70',
        )}
        onContextMenu={handleContextMenu}
      >
        <SliderPrimitive.Range
          className={clsx(
            'absolute h-full select-none rounded',
            variant === 'default' && 'bg-primary',
            variant === 'secondary' && 'bg-secondary-foreground',
          )}
          onContextMenu={handleContextMenu}
        />
      </SliderPrimitive.Track>

      <SliderTooltip
        open={showTooltip && tooltipValue !== undefined}
        variant={variant}
        value={tooltipValue ?? ''}
        align="center"
      >
        <SliderPrimitive.Thumb
          className={clsx(
            'block opacity-0 h-3 w-3 cursor-pointer select-none rounded-full',
            'border-2 ring-offset-background transition-[background-color,opacity]',
            'focus-visible:outline-none focus-visible:ring-transparent',
            'disabled:pointer-events-none disabled:opacity-50 transform-gpu',
            showTooltip && 'opacity-100',
            variant === 'default' && 'bg-foreground border-foreground',
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

type SliderTooltipProps = React.ComponentPropsWithoutRef<
  typeof TooltipContent
> & {
  open: boolean
  value: string
  variant: Variant
  position?: number
}

function SliderTooltip({
  open,
  value,
  variant,
  children,
  position,
  ...props
}: SliderTooltipProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  const alignOffset = React.useMemo(() => {
    if (!position || !contentRef.current) return undefined

    const contentWidth = contentRef.current.getBoundingClientRect().width
    return position - contentWidth / 2
  }, [position])

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip open={open}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          ref={contentRef}
          className={clsx(
            'px-2 py-1',
            variant === 'default' && 'bg-background',
            variant === 'secondary' &&
              'bg-secondary-foreground border-muted-foreground/50 text-secondary font-semibold text-base',
          )}
          sticky="always"
          hideWhenDetached={true}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onMouseUp={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          style={{ cursor: 'default' }}
          alignOffset={alignOffset}
          {...props}
        >
          <p>{value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

type ProgressSliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> & {
  variant?: Variant
  tooltipValue?: string
  tooltipTransformer?: (value: number) => string
}

export function ProgressSlider(props: ProgressSliderProps) {
  const {
    className,
    tooltipValue,
    tooltipTransformer,
    variant = 'default',
    onValueChange,
    ...rest
  } = props

  const sliderRef = React.useRef<HTMLSpanElement | null>(null)
  const frameId = React.useRef<number | null>(null)

  const [showTooltip, setShowTooltip] = React.useState(false)
  const [tooltipComputedValue, setTooltipComputedValue] = React.useState(0)
  const [cursorPosition, setCursorPosition] = React.useState(0)

  const maxValue = props.max ?? 0

  const enableTooltip = React.useMemo(() => {
    const hasAnyTooltipProps =
      tooltipValue !== undefined || tooltipTransformer !== undefined

    return showTooltip && hasAnyTooltipProps
  }, [showTooltip, tooltipTransformer, tooltipValue])

  const formattedTooltipValue = React.useMemo(() => {
    if (typeof tooltipTransformer === 'undefined' && tooltipValue) {
      return tooltipValue
    }

    if (tooltipTransformer) {
      return tooltipTransformer(tooltipComputedValue)
    }

    return ''
  }, [tooltipComputedValue, tooltipTransformer, tooltipValue])

  const updateTooltip = (mouseX: number, width: number) => {
    const rawTime = (mouseX / width) * maxValue
    const time = Math.max(0, Math.round(rawTime))

    const position = Math.max(0, Math.round(mouseX)) + 1
    setCursorPosition(position)
    setTooltipComputedValue(time)

    frameId.current = null
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return

    const sliderRect = sliderRef.current.getBoundingClientRect()
    const mouseX = event.clientX - sliderRect.left
    const sliderWidth = sliderRect.width

    if (!frameId.current) {
      frameId.current = requestAnimationFrame(() =>
        updateTooltip(mouseX, sliderWidth),
      )
    }
  }

  const computeBoundaries = (mouseX: number, mouseY: number) => {
    if (!sliderRef.current) return undefined

    const sliderRect = sliderRef.current.getBoundingClientRect()
    const { right, left, top, bottom } = {
      left: sliderRect.left - 2,
      right: sliderRect.right,
      top: sliderRect.top - 1.5,
      bottom: sliderRect.bottom + 1,
    }

    const xLimits = mouseX >= left && mouseX <= right
    const yLimits = mouseY >= top && mouseY <= bottom
    const isInside = xLimits && yLimits

    return {
      isInside,
      left,
      right,
      top,
      bottom,
      width: sliderRect.width,
    }
  }

  const handleMouseOver = (event: React.MouseEvent<HTMLDivElement>) => {
    const [mouseX, mouseY] = [event.clientX, event.clientY]

    const bounds = computeBoundaries(mouseX, mouseY)
    if (!bounds) return

    const { isInside, left, width } = bounds

    if (isInside) {
      if (!frameId.current) {
        frameId.current = requestAnimationFrame(() =>
          updateTooltip(mouseX - left, width),
        )
      }

      setShowTooltip(true)
    }
  }

  const computeCurrentValuePosition = (value: number) => {
    if (!sliderRef.current) return

    const { width } = sliderRef.current.getBoundingClientRect()

    const percentage = (value / maxValue) * 100
    const mousePosition = (percentage / 100) * width
    const positionWithLimits = Math.max(0, mousePosition) + 1

    setCursorPosition(positionWithLimits)
  }

  const handleValueChange = (value: number) => {
    if (onValueChange) onValueChange([value])
    setTooltipComputedValue(value)
    computeCurrentValuePosition(value)
  }

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  return (
    <SliderPrimitive.Root
      ref={sliderRef}
      className={cn(
        'relative h-3 flex w-full touch-none select-none items-center cursor-pointer',
        className,
      )}
      onMouseOver={handleMouseOver}
      onMouseOut={() => setShowTooltip(false)}
      onMouseMove={handleMouseMove}
      onValueChange={([value]) => handleValueChange(value)}
      {...rest}
    >
      <SliderTooltip
        open={enableTooltip}
        variant={variant}
        value={formattedTooltipValue}
        position={cursorPosition}
        align="start"
        sideOffset={8}
      >
        <SliderPrimitive.Track
          className={clsx(
            'relative h-1 w-full grow overflow-hidden rounded-full select-none',
            variant === 'default' && 'bg-secondary',
            variant === 'secondary' && 'bg-muted-foreground/70',
          )}
          onContextMenu={handleContextMenu}
        >
          <SliderPrimitive.Range
            className={clsx(
              'absolute h-full select-none transition-[border-radius]',
              variant === 'default' && 'bg-primary',
              variant === 'secondary' && 'bg-secondary-foreground',
              showTooltip ? 'rounded-none' : 'rounded',
            )}
            onContextMenu={handleContextMenu}
          />
        </SliderPrimitive.Track>
      </SliderTooltip>

      <SliderPrimitive.Thumb
        className={clsx(
          'block opacity-0 h-3 w-3 cursor-pointer select-none rounded-full',
          'border-2 transition-[background-color,opacity]',
          'focus-visible:outline-none focus-visible:ring-transparent',
          'disabled:pointer-events-none disabled:opacity-50 transform-gpu',
          showTooltip && 'opacity-100',
          variant === 'default' && 'bg-foreground border-foreground',
          variant === 'secondary' &&
            'bg-secondary-foreground border-secondary-foreground',
        )}
        onKeyDown={(e) => e.preventDefault()}
      />
    </SliderPrimitive.Root>
  )
}
