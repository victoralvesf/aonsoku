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
        'bg-gradient-to-b from-white/60 to-[--main-background]',
        'dark:from-black/50 dark:to-[--main-background]',
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
