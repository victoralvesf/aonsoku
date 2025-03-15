import clsx from 'clsx'
import { memo } from 'react'
import { useSongColor } from '@/store/player.store'
import { MiniPlayerControls } from './controls'
import { MiniPlayerProgress } from './progress'
import { MiniPlayerSongImage } from './song-image'
import { MiniPlayerSongTitle } from './song-title'

const MemoMiniPlayerControls = memo(MiniPlayerControls)
const MemoMiniPlayerProgress = memo(MiniPlayerProgress)
const MemoMiniPlayerSongImage = memo(MiniPlayerSongImage)
const MemoMiniPlayerSongTitle = memo(MiniPlayerSongTitle)

export function MiniPlayer() {
  const { currentSongColor } = useSongColor()

  return (
    <div className="w-full h-full flex flex-col gap-2 p-2">
      <div
        className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-b from-background/20 to-background/50 rounded-md overflow-hidden"
        style={{ backgroundColor: currentSongColor ?? undefined }}
      >
        <div className="flex w-full h-full relative p-4 justify-center items-center group">
          <MemoMiniPlayerSongImage />
          <div
            className={clsx(
              'flex flex-col w-full gap-4 absolute inset-0',
              'bg-black/80 opacity-0 group-hover:opacity-100',
              'transition-opacity duration-300',
            )}
          >
            <div className="flex flex-col flex-1 px-4 justify-center items-center absolute inset-0">
              <MemoMiniPlayerControls />
            </div>
            <div className="mt-auto px-2 pb-1">
              <MemoMiniPlayerProgress />
            </div>
          </div>
        </div>
      </div>
      <div className="h-12 pb-2">
        <MemoMiniPlayerSongTitle />
      </div>
    </div>
  )
}
