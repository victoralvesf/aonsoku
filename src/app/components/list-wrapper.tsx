import { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/utils'

type ListWrapperProps = ComponentPropsWithRef<'div'>

export default function ListWrapper({ children, className }: ListWrapperProps) {
  return (
    <div
      className={cn(
        'w-full px-8 py-6 bg-transparent relative z-10',
        className,
      )}
    >
      {children}
    </div>
  )
}
