import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type DotProps = ComponentPropsWithoutRef<'span'>

export function Dot({ className, ...props }: DotProps) {
  return (
    <span
      className={cn('mx-1 opacity-80 text-foreground', className)}
      {...props}
    >
      •
    </span>
  )
}
