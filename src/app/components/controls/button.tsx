import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function ControlButton({
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'inline-flex cursor-default items-center justify-center outline-none',
        className,
      )}
      {...props}
      tabIndex={-1}
    >
      {children}
    </button>
  )
}
