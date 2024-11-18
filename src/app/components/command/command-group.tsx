import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'

export function CustomGroup({ children }: { children: ReactNode }) {
  return <div className="flex flex-col pt-1.5">{children}</div>
}

export function CustomGroupHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-between py-0.5 px-4 text-xs font-medium text-muted-foreground">
      {children}
    </div>
  )
}

type HeaderLinkProps = ComponentPropsWithoutRef<typeof Button>

export function CustomHeaderLink({
  className,
  children,
  ...props
}: HeaderLinkProps) {
  return (
    <Button
      className={cn('text-xs p-0 m-0 h-fit underline-offset-1', className)}
      size="sm"
      variant="link"
      {...props}
    >
      {children}
    </Button>
  )
}
