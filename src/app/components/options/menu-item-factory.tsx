import { ReactNode } from 'react'
import { ContextMenuItem } from '@/app/components/ui/context-menu'
import { DropdownMenuItem } from '@/app/components/ui/dropdown-menu'

type MenuItemFactoryProps = {
  variant: 'dropdown' | 'context'
  icon: ReactNode
  label: string
  className?: string
} & React.ComponentPropsWithoutRef<
  typeof DropdownMenuItem | typeof ContextMenuItem
>

export function MenuItemFactory({
  variant,
  icon,
  label,
  className,
  ...props
}: MenuItemFactoryProps) {
  const content = (
    <>
      {icon}
      <span>{label}</span>
    </>
  )

  if (variant === 'context') {
    return (
      <ContextMenuItem className={className} {...props}>
        {content}
      </ContextMenuItem>
    )
  }

  return (
    <DropdownMenuItem className={className} {...props}>
      {content}
    </DropdownMenuItem>
  )
}
