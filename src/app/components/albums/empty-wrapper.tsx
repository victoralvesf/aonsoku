import { ReactNode } from 'react'

interface EmptyWrapperProps {
  children: ReactNode
}

export function EmptyWrapper({ children }: EmptyWrapperProps) {
  return (
    <div className="h-full flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      {children}
    </div>
  )
}
