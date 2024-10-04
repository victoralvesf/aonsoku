import clsx from 'clsx'
import { CoverImage } from '@/app/components/table/cover-image'
import { usePlayerMediaType, usePlayerSonglist } from '@/store/player.store'
import { ISong } from '@/types/responses/song'

export function TableSongTitle({ song }: { song: ISong }) {
  const { currentSong } = usePlayerSonglist()
  const mediaType = usePlayerMediaType()

  function getSongIsPlaying() {
    if (mediaType === 'radio' || !currentSong) return false

    return currentSong.id === song.id
  }

  const songIsPlaying = getSongIsPlaying()

  return (
    <div className="flex w-full gap-2 items-center">
      <CoverImage
        coverArt={song.coverArt}
        coverArtType="song"
        altText={song.title}
      />
      <div className="flex flex-col w-full justify-center truncate">
        <span
          className={clsx(
            'font-medium truncate',
            songIsPlaying && 'text-primary drop-shadow',
          )}
        >
          {song.title}
        </span>
      </div>
    </div>
  )
}
