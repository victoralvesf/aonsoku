import { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type ShadowHeaderProps = ComponentProps<'div'>

export function ShadowHeader({
  children,
  className,
  ...rest
}: ShadowHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-start px-8 h-[--shadow-header-height] fixed top-[--header-height] right-0 left-[--mini-sidebar-width] lg:left-[--sidebar-width] z-30 border-b bg-background backdrop-blur-xl supports-[backdrop-filter]:bg-background/60',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
