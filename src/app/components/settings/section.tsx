import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Separator } from '@/app/components/ui/separator'
import { cn } from '@/lib/utils'

type SectionComponent = ComponentPropsWithoutRef<'div'>

export function Root({ children, className, ...props }: SectionComponent) {
  return (
    <div className={cn('w-full', className)} {...props}>
      {children}
    </div>
  )
}

export function Header({ children, className, ...props }: SectionComponent) {
  return (
    <div className={cn('w-full mb-4 space-y-2', className)} {...props}>
      {children}
    </div>
  )
}

export function HeaderTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="font-medium leading-none text-foreground">{children}</h3>
  )
}

export function HeaderDescription({ children }: { children: ReactNode }) {
  return <p className="text-xs text-muted-foreground">{children}</p>
}

export function Content({ children, className, ...props }: SectionComponent) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {children}
    </div>
  )
}

export function ContentItem({
  children,
  className,
  ...props
}: SectionComponent) {
  return (
    <div
      className={cn('flex items-center space-between min-h-8', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ContentItemTitle({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 items-center">
      <span className="text-sm leading-none text-foreground">{children}</span>
    </div>
  )
}

export function ContentItemForm({
  children,
  className,
  ...props
}: SectionComponent) {
  return (
    <div
      className={cn('w-1/3 flex items-center justify-end', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ContentSeparator() {
  return <Separator className="mt-4" />
}
