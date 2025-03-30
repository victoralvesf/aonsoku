import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useRef } from 'react'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerSonglist,
} from '@/store/player.store'
import { QueueItem } from './queue-item'

export function FullscreenSongQueue() {
  const { setSongList } = usePlayerActions()
  const { currentList, currentSongIndex, currentSong } = usePlayerSonglist()
  const isPlaying = usePlayerIsPlaying()

  const parentRef = useRef<HTMLDivElement>(null)

  const getScrollElement = () => {
    if (!parentRef.current) return null

    return parentRef.current.querySelector('[data-radix-scroll-area-viewport]')
  }

  const virtualizer = useVirtualizer({
    count: currentList.length,
    getScrollElement,
    estimateSize: () => 64,
    overscan: 5,
  })

  useEffect(() => {
    if (currentSongIndex >= 0) {
      virtualizer.scrollToIndex(currentSongIndex, { align: 'start' })
    }
  }, [currentSongIndex, virtualizer])

  if (currentList.length === 0)
    return (
      <div className="flex justify-center items-center">
        <span>No songs in queue</span>
      </div>
    )

  return (
    <ScrollArea
      ref={parentRef}
      type="always"
      className="min-h-full h-full overflow-auto"
      thumbClassName="secondary-thumb-bar"
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const entry = currentList[virtualRow.index]
          return (
            <QueueItem
              key={entry.id}
              data-row-index={virtualRow.index}
              data-state={currentSong.id === entry.id ? 'active' : 'inactive'}
              index={virtualRow.index}
              song={entry}
              isPlaying={currentSong.id === entry.id && isPlaying}
              onClick={() => {
                if (currentSong.id !== entry.id) {
                  setSongList(currentList, virtualRow.index)
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            />
          )
        })}
      </div>
    </ScrollArea>
  )
}
