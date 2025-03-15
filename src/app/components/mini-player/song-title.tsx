import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { usePlayerCurrentSong } from '@/store/player.store'
import { MarqueeTitle } from '../fullscreen/marquee-title'

export function MiniPlayerSongTitle() {
  const song = usePlayerCurrentSong()

  return (
    <div className="flex flex-col justify-center max-w-full overflow-hidden">
      <MarqueeTitle gap="mr-2">
        <Link to={ROUTES.ALBUM.PAGE(song.albumId)}>
          <span
            className="text-sm font-medium hover:underline cursor-pointer"
            data-testid="track-title"
          >
            {song.title}
          </span>
        </Link>
      </MarqueeTitle>
      <Link
        to={ROUTES.ARTIST.PAGE(song.artistId!)}
        className={cn(
          'w-fit inline-flex',
          !song.artistId && 'pointer-events-none',
        )}
        data-testid="track-artist-url"
      >
        <span
          className={cn(
            'text-xs font-regular text-foreground/70',
            song.artistId && 'hover:underline',
          )}
        >
          {song.artist}
        </span>
      </Link>
    </div>
  )
}
