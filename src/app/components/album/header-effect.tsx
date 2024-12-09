import { ComponentPropsWithoutRef, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export const ImageHeaderEffect = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<'div'>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-gradient-to-b from-background/60 to-background-foreground',
        'w-full h-64 z-0',
        'absolute top-[calc(3rem+200px)] 2xl:top-[calc(3rem+250px)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
})
ImageHeaderEffect.displayName = 'ImageHeaderEffect'
