import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type ShadowHeaderProps = ComponentProps<'div'> & {
  showGlassEffect?: boolean
  fixed?: boolean
}

export function ShadowHeader({
  children,
  className,
  showGlassEffect = true,
  fixed = true,
  ...rest
}: ShadowHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-start px-8 h-[--shadow-header-height] border-b bg-background',
        fixed &&
          'fixed top-header right-0 left-mini-sidebar 2xl:left-sidebar z-30',
        showGlassEffect &&
          'backdrop-blur-lg supports-[backdrop-filter]:bg-background/80',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
