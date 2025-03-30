import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import * as React from 'react'

import { cn } from '@/lib/utils'

export const scrollAreaViewportSelector = '[data-radix-scroll-area-viewport]'

type ScrollAreaProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.Root
> & {
  scrollBarClassName?: string
  thumbClassName?: string
}

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollAreaProps
>((props, ref) => {
  const { className, scrollBarClassName, thumbClassName, children, ...rest } =
    props

  return (
    <ScrollAreaPrimitive.Root
      ref={ref}
      className={cn('relative overflow-hidden', className)}
      {...rest}
    >
      <ScrollAreaPrimitive.Viewport
        id="scroll-viewport"
        className="h-full w-full rounded-[inherit] [&>div]:!block"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar
        className={scrollBarClassName}
        thumbClassName={thumbClassName}
      />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

type ScrollBarProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
> & {
  thumbClassName?: string
}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, thumbClassName, orientation = 'vertical', ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      'flex touch-none select-none transition-colors z-30',
      orientation === 'vertical' &&
        'h-full w-2.5 border-l border-l-transparent p-[1px]',
      orientation === 'horizontal' &&
        'h-2.5 flex-col border-t border-t-transparent p-[1px]',
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb
      className={cn(
        'relative flex-1 rounded-full bg-border transition-colors',
        thumbClassName,
      )}
    />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
