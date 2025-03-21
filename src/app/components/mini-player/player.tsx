import clsx from 'clsx'
import { memo } from 'react'
import { ResizeHandler } from '@/app/components/icons/resize-handler'
import { useSongColor } from '@/store/player.store'
import { MiniPlayerControls, MiniPlayerLikeButton } from './controls'
import { MiniPlayerProgress } from './progress'
import { MiniPlayerSongImage } from './song-image'
import { MiniPlayerSongTitle } from './song-title'
import { MiniPlayerVolume } from './volume'

const MemoMiniPlayerControls = memo(MiniPlayerControls)
const MemoMiniPlayerLikeButton = memo(MiniPlayerLikeButton)
const MemoMiniPlayerProgress = memo(MiniPlayerProgress)
const MemoMiniPlayerSongImage = memo(MiniPlayerSongImage)
const MemoMiniPlayerSongTitle = memo(MiniPlayerSongTitle)
const MemoMiniPlayerVolume = memo(MiniPlayerVolume)

export function MiniPlayer() {
  const { currentSongColor } = useSongColor()

  return (
    <div className="w-screen h-screen max-h-screen grid grid-rows-1 mid-player:grid-rows-floating-player gap-2 mid-player:gap-1 p-1 mid-player:p-2 mini-player:p-1.5 pb-4 mid-player:pb-4 relative">
      <div
        className={clsx(
          'w-full h-full gap-2 grid grid-rows-floating-player',
          'mid-player:grid-rows-1 mid-player:grid-cols-mid-player-info mid-player:items-center',
          'mini-player:grid-rows-1 mini-player:grid-cols-mini-player mini-player:items-center',
        )}
      >
        <div
          className={clsx(
            'w-full h-full mid-player:aspect-square mini-player:aspect-square',
            'flex flex-col items-center justify-center gap-2',
            'default-gradient rounded-md mini-player:rounded',
            'transition-[background-image,background-color] duration-1000 overflow-hidden',
            'mid-player:!bg-transparent mid-player:from-transparent mid-player:to-transparent',
            'mini-player:!bg-transparent mini-player:from-transparent mini-player:to-transparent',
          )}
          style={{ backgroundColor: currentSongColor ?? undefined }}
        >
          <div
            className={clsx(
              'flex w-full h-full relative p-3 justify-center items-center group bg-transparent',
              'mid-player:min-h-fit mid-player:max-h-full mid-player:p-0 mid-player:aspect-square',
              'mini-player:min-h-fit mini-player:max-h-full mini-player:p-0 mini-player:aspect-square',
            )}
          >
            <MemoMiniPlayerSongImage />
            <div
              className={clsx(
                'flex flex-col w-full gap-4 absolute inset-0',
                'bg-gradient-to-b from-background/70 via-background/50 via-50% to-background to-90%',
                'opacity-0 group-hover:opacity-100',
                'transition-opacity duration-300',
                'mid-player:hidden mini-player:hidden',
              )}
            >
              <div className="flex flex-col flex-1 px-2 justify-center items-center absolute inset-0">
                <MemoMiniPlayerControls />
              </div>
              <div className="mb-auto px-2 pt-0.5">
                <MemoMiniPlayerVolume />
              </div>
              <div className="mt-auto px-2 pb-0.5">
                <MemoMiniPlayerProgress />
              </div>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            'min-w-12 h-12 flex items-center justify-between pb-2 pl-1 mini-player:h-10',
            'mid-player:pl-0 mini-player:pl-0 mid-player:pb-0 mini-player:pb-0.5 mid-player:flex-1',
          )}
        >
          <MemoMiniPlayerSongTitle />
          <MemoMiniPlayerLikeButton />
        </div>
        <div className="hidden mini-player:flex">
          <MemoMiniPlayerControls />
        </div>
      </div>
      <div className="hidden mid-player:flex justify-center items-center h-10 max-h-10">
        <MemoMiniPlayerControls />
      </div>
      <ResizeHandler className="absolute w-5 h-5 bottom-0 right-0 text-foreground/50" />
    </div>
  )
}
