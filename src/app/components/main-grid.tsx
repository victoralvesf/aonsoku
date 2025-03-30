import { Settings2 } from 'lucide-react'
import { ComponentPropsWithoutRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { PageViewType } from '@/types/serverConfig'

type MainGridProps = ComponentPropsWithoutRef<'div'>

export function MainGrid({ className, ...props }: MainGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8 gap-4 h-full',
        className,
      )}
      {...props}
    />
  )
}

type MainViewTypeSelectorProps = {
  viewType: PageViewType
  setViewType: (type: PageViewType) => void
}

export function MainViewTypeSelector({
  viewType,
  setViewType,
}: MainViewTypeSelectorProps) {
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="size-9">
          <Settings2 className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuLabel className="text-muted-foreground font-medium">
          {t('generic.viewMode.label')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={viewType === 'table'}
          onCheckedChange={() => setViewType('table')}
        >
          <span>{t('generic.viewMode.modes.list')}</span>
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={viewType === 'grid'}
          onCheckedChange={() => setViewType('grid')}
        >
          <span>{t('generic.viewMode.modes.poster')}</span>
          <Badge className="ml-2" variant="beta">
            {t('generic.beta')}
          </Badge>
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
