import { memo } from 'react'
import { MarqueeTitle } from '@/app/components/fullscreen/marquee-title'
import { Badge } from '@/app/components/ui/badge'
import { usePlayerStore } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { ALBUM_ARTISTS_MAX_NUMBER } from '@/utils/multipleArtists'
import { FullscreenSongImage } from './song-image'
import { LyricsTab } from './lyrics'

const MemoFullscreenSongImage = memo(FullscreenSongImage)
const MemoLyricsTab = memo(LyricsTab)


export function SongInfo() {
  const currentSong = usePlayerStore((state) => state.songlist.currentSong)

  return (
    <div className="flex flex-col h-full min-h-full max-h-full gap-4 2xl:gap-6 flex-1 pt-2 overflow-hidden">
      <div className="w-full">
        <MarqueeTitle gap="mr-6">
          <h2 className="scroll-m-20 text-4xl 2xl:text-5xl font-bold tracking-tight py-2 2xl:py-3 text-shadow-2xl">
            {currentSong.title}
          </h2>
        </MarqueeTitle>
      </div>
      <div className="flex items-start justify-start h-full min-h-full max-h-full gap-4 2xl:gap-6 flex-1 overflow-hidden pb-4">
        <div className='flex flex-col'>
          <div className="flex flex-col">
            <div className="mb-8">
              <MemoFullscreenSongImage />
            </div>
            <AlbumName song={currentSong} />
            <ArtistNames song={currentSong} />

            <div className="flex gap-2 mt-2 2xl:mt-3 mb-[1px]">
              {currentSong.genre && (
                <Badge variant="neutral">{currentSong.genre}</Badge>
              )}
              {currentSong.year && (
                <Badge variant="secondary">{currentSong.year}</Badge>
              )}
            </div>
          </div>
        </div>
        <MemoLyricsTab />
      </div>
    </div>
  )
}


function AlbumName({ song }: { song: ISong }) {
  return <p className="truncate text-shadow-lg">{song.album}</p>
}


function ArtistNames({ song }: { song: ISong }) {
  const { artist, artists } = song

  if (artists && artists.length > 1) {
    const data = artists.slice(0, ALBUM_ARTISTS_MAX_NUMBER)

    return (
      <div className="flex items-center gap-1">
        {data.map(({ id, name }, index) => (
          <div key={id} className="flex">
            <p className="truncate text-shadow-lg">{name}</p>
            {index < data.length - 1 && ','}
          </div>
        ))}
      </div>
    )
  }

  return <p className="truncate text-shadow-lg">{artist}</p>
}
