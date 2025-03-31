import { InfoIcon } from 'lucide-react'
import { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Separator } from '@/app/components/ui/separator'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
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

interface ContentItemTitleProps extends ComponentPropsWithoutRef<'span'> {
  info?: string
}

export function ContentItemTitle({
  info,
  className,
  children,
}: ContentItemTitleProps) {
  return (
    <div className="flex flex-1 items-center gap-1">
      <span className={cn('text-sm leading-none text-foreground', className)}>
        {children}
      </span>
      {info && (
        <SimpleTooltip text={info} delay={0}>
          <div className="hover:bg-muted-foreground/20 p-1 rounded cursor-pointer">
            <InfoIcon className="w-3 h-3" />
          </div>
        </SimpleTooltip>
      )}
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
      className={cn('w-2/5 max-w-52 flex items-center justify-end', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export function ContentSeparator() {
  return <Separator className="mt-4" />
}
