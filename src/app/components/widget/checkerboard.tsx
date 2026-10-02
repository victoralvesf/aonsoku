import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'

export function CheckerboardContainer({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn('block rounded-sm p-3', className)}
      style={{
        backgroundImage:
          'linear-gradient(45deg, #6b7280 25%, transparent 25%), linear-gradient(-45deg, #6b7280 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6b7280 75%), linear-gradient(-45deg, transparent 75%, #6b7280 75%)',
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
        backgroundColor: '#4b5563',
      }}
      {...props}
    >
      {children}
    </div>
  )
}
