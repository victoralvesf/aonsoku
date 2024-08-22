import { ListVideo } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { QueuePage } from '@/app/components/queue/page'
import { Button } from '@/app/components/ui/button'
import { usePlayerActions, useQueueDrawerState } from '@/store/player.store'

interface PlayerSongListButtonProps {
  disabled: boolean
}

export function PlayerSongListButton({ disabled }: PlayerSongListButtonProps) {
  const queueDrawerState = useQueueDrawerState()
  const { setQueueDrawerState } = usePlayerActions()

  return (
    <Fragment>
      <Button
        variant="ghost"
        className="rounded-full w-10 h-10 p-2"
        disabled={disabled}
        onClick={() => setQueueDrawerState(!queueDrawerState)}
      >
        <ListVideo className="w-4 h-4" />
      </Button>

      <QueuePage />
    </Fragment>
  )
}
