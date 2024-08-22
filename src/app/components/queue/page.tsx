import { ChevronDownIcon } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'
import { CurrentSongInfo } from '@/app/components/queue/current-song-info'
import { QueueSongList } from '@/app/components/queue/song-list'
import { Button } from '@/app/components/ui/button'
import { Drawer, DrawerContent } from '@/app/components/ui/drawer'
import { usePlayerActions, useQueueDrawerState } from '@/store/player.store'

export function QueuePage() {
  const queueDrawerState = useQueueDrawerState()
  const { setQueueDrawerState } = usePlayerActions()

  useHotkeys('esc', () => setQueueDrawerState(false), {
    enabled: queueDrawerState,
  })

  return (
    <Drawer
      open={queueDrawerState}
      onClose={() => setQueueDrawerState(false)}
      fixed={true}
      handleOnly={true}
      disablePreventScroll={true}
      dismissible={true}
      modal={false}
    >
      <DrawerContent
        className="queue-list-drawer rounded-t-none border-none select-none cursor-default outline-none"
        showHandle={false}
      >
        <div className="flex w-full h-14 min-h-14 px-[6%] items-center justify-end">
          <Button
            variant="ghost"
            className="w-10 h-10 rounded-full p-0"
            onClick={() => setQueueDrawerState(false)}
          >
            <ChevronDownIcon />
          </Button>
        </div>
        <div className="flex w-full h-full mt-8 px-[6%] mb-0">
          <CurrentSongInfo />

          <QueueSongList />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
