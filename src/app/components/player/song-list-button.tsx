import { ListVideo } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { QueuePage } from '@/app/components/queue/page'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { usePlayerActions, useQueueDrawerState } from '@/store/player.store'

interface PlayerSongListButtonProps {
  disabled: boolean
}

export function PlayerSongListButton({ disabled }: PlayerSongListButtonProps) {
  const { t } = useTranslation()
  const queueDrawerState = useQueueDrawerState()
  const { setQueueDrawerState } = usePlayerActions()

  return (
    <Fragment>
      <SimpleTooltip text={t('queue.title')}>
        <Button
          variant="ghost"
          className="rounded-full w-10 h-10 p-2"
          disabled={disabled}
          onClick={() => setQueueDrawerState(!queueDrawerState)}
        >
          <ListVideo className="w-4 h-4" />
        </Button>
      </SimpleTooltip>

      <QueuePage />
    </Fragment>
  )
}
