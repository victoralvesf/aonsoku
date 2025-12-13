import { SearchIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { useMainSidebar } from '@/app/components/ui/main-sidebar'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/app.store'

export function MiniSidebarSearch({
  className,
}: React.ComponentProps<typeof Button>) {
  const setOpen = useAppStore((state) => state.command.setOpen)
  const { t } = useTranslation()
  const { open: sidebarOpen } = useMainSidebar()

  if (sidebarOpen) {
    return null
  }

  return (
    <div className="w-full px-4">
      <SimpleTooltip text={t('sidebar.miniSearch')} side="right" delay={50}>
        <Button
          variant="ghost"
          className={cn(
            'w-full h-fit flex flex-col justify-center items-center gap-1 mr-auto',
            className,
          )}
          onClick={() => setOpen(true)}
        >
          <SearchIcon className="w-4 h-4" />
        </Button>
      </SimpleTooltip>
    </div>
  )
}
