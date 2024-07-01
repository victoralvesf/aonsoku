import { Column } from '@tanstack/react-table'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
  RotateCcwIcon,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const { t } = useTranslation()

  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ChevronUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t('table.sort.asc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ChevronDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t('table.sort.desc')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.clearSorting()}>
            <RotateCcwIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            {t('table.sort.reset')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
