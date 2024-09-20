import { useTranslation } from 'react-i18next'
import { Keyboard } from '@/app/components/command/keyboard-key'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { playbackShortcuts } from '@/shortcuts/playback'
import { ShortcutsGroup } from './group'

interface ShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0">
        <DialogHeader className="p-6 border-b-[1px] border-b-border mb-0">
          <DialogTitle>{t('shortcuts.modal.title')}</DialogTitle>
          <div className="flex gap-1 text-sm text-muted-foreground">
            <p>{t('shortcuts.modal.description.first')}</p>{' '}
            <Keyboard
              text="⌘"
              className="ml-3 relative w-5 top-0 text-base pl-[4px] pt-[1px]"
            />{' '}
            <Keyboard text="/" className="relative w-5 top-0" />
            <p className="-ml-1">{t('shortcuts.modal.description.last')}</p>
          </div>
        </DialogHeader>
        <div className="px-6 pt-4 pb-6 max-h-[400px] overflow-y-auto space-y-4">
          <ShortcutsGroup
            title={t('shortcuts.playback.label')}
            shortcuts={playbackShortcuts}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
