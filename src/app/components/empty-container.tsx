import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export function EmptyPageContainer({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div className={cn('w-full h-empty-content', className)} {...props}>
      {children}
    </div>
  )
}
