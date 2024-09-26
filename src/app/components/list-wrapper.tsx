import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ListWrapperProps {
  children: ReactNode
  className?: string
}

export default function ListWrapper({ children, className }: ListWrapperProps) {
  return (
    <div
      className={cn(
        'w-full px-8 py-6 pt-0 bg-transparent relative z-10',
        className,
      )}
    >
      {children}
    </div>
  )
}
