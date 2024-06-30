import { ReactNode } from 'react'
import { EllipsisVertical } from 'lucide-react'
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
      >
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 p-1 rounded-full data-[state=open]:bg-accent"
        >
          <EllipsisVertical className="w-4 h-4" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      {optionsMenuItems && (
        <DropdownMenuContent align="end">
          {optionsMenuItems}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
