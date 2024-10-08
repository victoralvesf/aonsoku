import {
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/app/components/ui/context-menu'
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/app/components/ui/dropdown-menu'

type SubMenuFactoryProps = {
  variant: 'dropdown' | 'context'
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}

export function SubMenuFactory({
  variant,
  icon,
  label,
  children,
}: SubMenuFactoryProps) {
  const content = (
    <>
      {icon}
      <span>{label}</span>
    </>
  )

  if (variant === 'context') {
    return (
      <ContextMenuSub>
        <ContextMenuSubTrigger>{content}</ContextMenuSubTrigger>
        <ContextMenuSubContent className="p-0 max-w-[300px]">
          {children}
        </ContextMenuSubContent>
      </ContextMenuSub>
    )
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>{content}</DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="p-0 max-w-[300px]">
          {children}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  )
}
