import clsx from 'clsx'
import { EllipsisVertical } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'

interface TableActionButtonProps {
  optionsMenuItems?: ReactNode
}

export function TableActionButton({
  optionsMenuItems,
}: TableActionButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={(state) => setOpen(state)}>
      <DropdownMenuTrigger
        asChild
        className="outline-none focus-visible:ring-0 focus-visible:ring-transparent ring-0 ring-offset-transparent"
      >
        <Button
          variant="ghost"
          size="icon"
          className={clsx(
            'w-8 h-8 p-1 rounded-full hover:bg-background/80',
            'data-[state=open]:bg-accent data-[state=open]:opacity-100',
            'opacity-0 group-hover/tablerow:opacity-100 transition-opacity',
          )}
          onClick={(e) => {
            e.stopPropagation()
            setOpen(true)
          }}
        >
          <EllipsisVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      {optionsMenuItems && (
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {optionsMenuItems}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
