import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { useAppStore } from '@/store/app.store'

export function MiniSidebarSearch({
  title,
  icon,
}: {
  title: string
  icon: JSX.Element
}) {
  const setOpen = useAppStore((state) => state.command.setOpen)
  const { t } = useTranslation()

  return (
    <SimpleTooltip text={t(title)} side="right" delay={50}>
      <Button
        variant="ghost"
        className="w-full h-fit flex flex-col justify-center items-center gap-1"
        onClick={() => setOpen(true)}
      >
        {icon}
      </Button>
    </SimpleTooltip>
  )
}
