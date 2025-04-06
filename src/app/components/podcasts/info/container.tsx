import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

type ContainerProps = ComponentPropsWithoutRef<'div'>

export function PodcastInfoContainer({
  className,
  children,
  ...rest
}: ContainerProps) {
  return (
    <div {...rest} className={cn('w-full px-8 py-6 flex gap-4', className)}>
      {children}
    </div>
  )
}
