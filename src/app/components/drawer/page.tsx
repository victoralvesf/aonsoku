import clsx from 'clsx'
import { ChevronDownIcon } from 'lucide-react'
import { ComponentPropsWithoutRef, useMemo } from 'react'
import { LyricsTab } from '@/app/components/fullscreen/lyrics'
import { CurrentSongInfo } from '@/app/components/queue/current-song-info'
import { QueueSongList } from '@/app/components/queue/song-list'
import { Button } from '@/app/components/ui/button'
import { Drawer, DrawerContent } from '@/app/components/ui/drawer'
import { cn } from '@/lib/utils'
import {
  useLyricsState,
  useMainDrawerState,
  useQueueState,
  useSongColor,
} from '@/store/player.store'

export function MainDrawerPage() {
  const { currentSongColor, useSongColorOnQueue } = useSongColor()
  const { mainDrawerState, closeDrawer } = useMainDrawerState()
  const { queueState } = useQueueState()
  const { lyricsState } = useLyricsState()

  const backgroundColor = useMemo(() => {
    if (!useSongColorOnQueue) return undefined

    return currentSongColor ?? undefined
  }, [currentSongColor, useSongColorOnQueue])

  return (
    <Drawer
      open={mainDrawerState}
      onClose={closeDrawer}
      fixed={true}
      handleOnly={true}
      disablePreventScroll={true}
      dismissible={true}
      modal={false}
    >
      <DrawerContent
        className={clsx(
          'main-drawer rounded-t-none border-none select-none cursor-default',
          'outline-none transition-[background-image,background-color] duration-1000',
          currentSongColor &&
            'bg-gradient-to-b from-background/40 to-background/60',
        )}
        showHandle={false}
        style={{
          backgroundColor,
        }}
      >
        <div className="flex w-full h-14 min-h-14 px-[6%] items-center justify-end">
          <Button
            variant="ghost"
            className="w-10 h-10 rounded-full p-0 hover:bg-background"
            onClick={closeDrawer}
          >
            <ChevronDownIcon />
          </Button>
        </div>
        <div className="flex w-full h-full mt-8 px-[6%] mb-0">
          <CurrentSongInfo />

          <div className="flex flex-1 justify-center relative">
            <ActiveContent active={queueState}>
              <QueueSongList />
            </ActiveContent>
            <ActiveContent active={lyricsState}>
              <LyricsTab />
            </ActiveContent>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

type ActiveContentProps = ComponentPropsWithoutRef<'div'> & {
  active: boolean
}

function ActiveContent({
  active,
  children,
  className,
  ...props
}: ActiveContentProps) {
  return (
    <div
      className={cn(
        'w-full h-full absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-300 bg-black/0',
        active && 'opacity-100 pointer-events-auto',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
