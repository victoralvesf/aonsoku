import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { usePlayerCurrentSong } from '@/store/player.store'
import { MarqueeTitle } from '../fullscreen/marquee-title'

export function MiniPlayerSongTitle() {
  const navigate = useNavigate()
  const song = usePlayerCurrentSong()

  function handleTitleClick() {
    navigate(ROUTES.ALBUM.PAGE(song.albumId))
  }

  function handleArtistClick() {
    if (!song.artistId) return

    navigate(ROUTES.ARTIST.PAGE(song.artistId))
  }

  return (
    <div className="flex flex-col flex-1 justify-center max-w-full overflow-hidden">
      <MarqueeTitle gap="mr-2">
        <span
          className="text-sm font-medium hover:underline cursor-pointer"
          data-testid="track-title"
          onClick={handleTitleClick}
        >
          {song.title}
        </span>
      </MarqueeTitle>
      <span
        className={cn(
          'w-fit max-w-full truncate text-xs font-regular text-foreground/70',
          song.artistId && 'hover:underline cursor-pointer',
        )}
        onClick={handleArtistClick}
      >
        {song.artist}
      </span>
    </div>
  )
}
