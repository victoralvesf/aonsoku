import clsx from 'clsx'
import { memo } from 'react'
import { useSongColor } from '@/store/player.store'
import { MiniPlayerControls, MiniPlayerLikeButton } from './controls'
import { MiniPlayerProgress } from './progress'
import { MiniPlayerSongImage } from './song-image'
import { MiniPlayerSongTitle } from './song-title'

const MemoMiniPlayerControls = memo(MiniPlayerControls)
const MemoMiniPlayerLikeButton = memo(MiniPlayerLikeButton)
const MemoMiniPlayerProgress = memo(MiniPlayerProgress)
const MemoMiniPlayerSongImage = memo(MiniPlayerSongImage)
const MemoMiniPlayerSongTitle = memo(MiniPlayerSongTitle)

export function MiniPlayer() {
  const { currentSongColor } = useSongColor()

  return (
    <div className="w-full h-full max-h-full flex flex-col gap-2 p-2">
      <div className="w-full h-full mid-player:max-h-fit flex flex-grow flex-col mid-player:flex-row mid-player:items-center gap-2">
        <div
          className={clsx(
            'w-full mid-player:w-[20%] mid-player:max-w-14 h-full mid-player:h-fit mid-player:min-h-12',
            'flex flex-col items-center justify-center gap-2',
            'bg-gradient-to-b from-background/20 to-background/50 rounded-md overflow-hidden',
            'transition-[background-color] duration-500',
          )}
          style={{ backgroundColor: currentSongColor ?? undefined }}
        >
          <div
            className={clsx(
              'flex w-full h-full relative p-4 mid-player:p-0 justify-center items-center group',
              'mid-player:min-w-fit mid-player:min-h-fit mid-player:aspect-square mid-player:max-w-14 mid-player:max-h-14',
            )}
          >
            <MemoMiniPlayerSongImage />
            <div
              className={clsx(
                'flex mid-player:hidden flex-col w-full gap-4 absolute inset-0',
                'bg-background/60 opacity-0 group-hover:opacity-100',
                'transition-[opacity,backdrop-filter] duration-300 backdrop-blur-sm',
              )}
            >
              <div className="flex flex-col flex-1 px-2 justify-center items-center absolute inset-0">
                <MemoMiniPlayerControls />
              </div>
              <div className="mt-auto px-2 pb-1">
                <MemoMiniPlayerProgress />
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-12 h-12 pb-2 mid-player:pb-0 flex mid-player:flex-1 items-center justify-between">
          <MemoMiniPlayerSongTitle />
          <MemoMiniPlayerLikeButton />
        </div>
      </div>
      <div className="hidden mid-player:flex justify-center items-center min-h-12">
        <MemoMiniPlayerControls />
      </div>
    </div>
  )
}
