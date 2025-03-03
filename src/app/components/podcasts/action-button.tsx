import clsx from 'clsx'
import { EllipsisVertical } from 'lucide-react'
import { ReactNode } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'

interface PodcastActionButtonProps {
  featured?: boolean
  children?: ReactNode
}

export function PodcastActionButton({
  featured = false,
  children,
}: PodcastActionButtonProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="outline-none focus-visible:ring-0 focus-visible:ring-transparent ring-0 ring-offset-transparent"
      >
        <Button
          variant="ghost"
          size="icon"
          className={clsx(
            'w-8 h-8 p-1 rounded-full data-[state=open]:bg-accent',
            !featured && 'hover:bg-background',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisVertical className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      {children && (
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {children}
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
