import { useTranslation } from 'react-i18next'
import { Keyboard } from '@/app/components/command/keyboard-key'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { shortcutDialogKeys, allShortcuts } from '@/shortcuts'
import { ShortcutsGroup } from './group'

interface ShortcutsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsDialog({ open, onOpenChange }: ShortcutsDialogProps) {
  const { t } = useTranslation()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0" aria-describedby={undefined}>
        <DialogHeader className="p-6 border-b-[1px] border-b-border mb-0">
          <DialogTitle>{t('shortcuts.modal.title')}</DialogTitle>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <p>{t('shortcuts.modal.description.first')}</p>
            {shortcutDialogKeys.map((key) => (
              <Keyboard
                key={key}
                text={key}
                className="text-base px-1.5 h-6 antialiased"
              />
            ))}
            <p>{t('shortcuts.modal.description.last')}</p>
          </div>
        </DialogHeader>
        <div className="px-6 pt-4 pb-6 max-h-[400px] overflow-y-auto space-y-4">
          {allShortcuts.map((item) => (
            <ShortcutsGroup
              key={item.id}
              title={t(item.label)}
              shortcuts={item.shortcuts}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
