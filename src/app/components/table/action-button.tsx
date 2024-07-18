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
        className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-1 rounded-full data-[state=open]:bg-accent hover:bg-background hover:border hover:border-border hover:shadow-sm"
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
