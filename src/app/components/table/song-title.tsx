import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { CoverImage } from '@/app/components/table/cover-image'
import { usePlayerMediaType, usePlayerSonglist } from '@/store/player.store'
import { ISong } from '@/types/responses/song'

export function TableSongTitle({ song }: { song: ISong }) {
  const { currentSong } = usePlayerSonglist()
  const mediaType = usePlayerMediaType()
  const [songIsPlaying, setSongIsPlaying] = useState(false)

  useEffect(() => {
    if (mediaType === 'radio') return

    const isPlaying = currentSong.id === song.id
    setSongIsPlaying(isPlaying)
  }, [currentSong, mediaType, song.id])

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
            songIsPlaying && 'text-primary',
          )}
        >
          {song.title}
        </span>
      </div>
    </div>
  )
}
