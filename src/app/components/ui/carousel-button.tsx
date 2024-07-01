import { ChevronLeft, ChevronRight } from 'lucide-react'
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface CarouselButtonProps extends React.ComponentProps<typeof Button> {
  direction: 'prev' | 'next'
}

const CarouselButton = React.forwardRef<HTMLButtonElement, CarouselButtonProps>(
  (
    { className, variant = 'outline', size = 'icon', direction, ...props },
    ref,
  ) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('h-8 w-8 rounded-full shadow-sm', className)}
        {...props}
      >
        {direction === 'prev' ? (
          <>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous slide</span>
          </>
        ) : (
          <>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next slide</span>
          </>
        )}
      </Button>
    )
  },
)

CarouselButton.displayName = 'CarouselButton'

export { CarouselButton }
