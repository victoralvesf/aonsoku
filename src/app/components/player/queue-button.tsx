import { PopoverAnchor } from '@radix-ui/react-popover'
import clsx from 'clsx'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ListVideo,
  ListXIcon,
} from 'lucide-react'
import { ComponentPropsWithoutRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { Popover, PopoverContent } from '@/app/components/ui/popover'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { cn } from '@/lib/utils'
import {
  useMainDrawerState,
  usePlayerActions,
  useQueueState,
} from '@/store/player.store'

interface PlayerSongListButtonProps {
  disabled: boolean
}

export function PlayerQueueButton({ disabled }: PlayerSongListButtonProps) {
  const { t } = useTranslation()
  const { mainDrawerState } = useMainDrawerState()
  const { queueState, toggleQueueAction } = useQueueState()
  const [openPopover, setOpenPopover] = useState(false)

  const isActive = mainDrawerState && queueState

  function handleClick() {
    toggleQueueAction()
  }

  return (
    <QueueMenuItems open={openPopover} onOpenChange={setOpenPopover}>
      <div>
        <SimpleTooltip text={t('queue.title')}>
          <Button
            variant="ghost"
            className={clsx(
              'rounded-full w-10 h-10 p-2 text-secondary-foreground relative',
              isActive && 'player-button-active',
            )}
            disabled={disabled}
            onClick={handleClick}
            onContextMenu={(e) => {
              e.preventDefault()
              setOpenPopover(!openPopover)
            }}
          >
            <ListVideo
              className={clsx('w-4 h-4', isActive && 'text-primary')}
            />
          </Button>
        </SimpleTooltip>
      </div>
    </QueueMenuItems>
  )
}

type QueueMenuItemsProps = ComponentPropsWithoutRef<typeof Popover> & {
  children: React.ReactNode
}

function QueueMenuItems({ open, onOpenChange, children }: QueueMenuItemsProps) {
  const { t } = useTranslation()
  const { mainDrawerState } = useMainDrawerState()
  const { queueState, toggleQueueAction } = useQueueState()
  const { clearPlayerState } = usePlayerActions()

  const isActive = mainDrawerState && queueState

  function closePopover() {
    if (onOpenChange) onOpenChange(false)
  }

  function handleOpenClose() {
    closePopover()
    toggleQueueAction()
  }

  function handleClearQueue() {
    closePopover()
    clearPlayerState()
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>{children}</PopoverAnchor>
      <PopoverContent side="top" className="p-1 w-fit !pointer-events-auto">
        <div className="flex flex-col items-start w-full">
          <QueueMenuItem onClick={handleOpenClose}>
            {isActive ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : (
              <ChevronUpIcon className="w-4 h-4" />
            )}
            <span>{isActive ? t('queue.close') : t('queue.open')}</span>
          </QueueMenuItem>
          <QueueMenuItem onClick={handleClearQueue}>
            <ListXIcon className="w-4 h-4" />
            <span>{t('queue.clear')}</span>
          </QueueMenuItem>
        </div>
      </PopoverContent>
    </Popover>
  )
}

type QueueMenuItemProps = ComponentPropsWithoutRef<typeof Button>

function QueueMenuItem({ className, children, ...props }: QueueMenuItemProps) {
  return (
    <Button
      {...props}
      role="menuitem"
      variant="ghost"
      size="sm"
      className={cn(
        'px-2 py-1.5 rounded cursor-default h-8 min-w-full flex items-center justify-start gap-2',
        className,
      )}
    >
      {children}
    </Button>
  )
}
