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
    <div className="w-screen h-screen max-h-screen grid grid-rows-1 mid-player:grid-rows-mini-player gap-2 p-2 pb-4">
      <div className="w-full h-full grid grid-rows-mini-player mid-player:grid-rows-1 mid-player:grid-cols-mid-player-info mid-player:items-center gap-2">
        <div
          className={clsx(
            'w-full h-full mid-player:aspect-square',
            'flex flex-col items-center justify-center gap-2',
            'bg-gradient-to-b from-background/20 to-background/50 rounded-md overflow-hidden',
            'transition-[background-color] duration-500 mid-player:!bg-background',
          )}
          style={{ backgroundColor: currentSongColor ?? undefined }}
        >
          <div
            className={clsx(
              'flex w-full h-full mid-player:min-h-fit mid-player:max-h-full relative p-4 mid-player:p-0 justify-center items-center group',
              'mid-player:aspect-square',
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
      <div className="hidden mid-player:flex justify-center items-center h-10 max-h-10">
        <MemoMiniPlayerControls />
      </div>
    </div>
  )
}
