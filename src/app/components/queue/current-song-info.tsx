import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { LinkWithoutTo } from '@/app/components/song/artist-link'
import { AspectRatio } from '@/app/components/ui/aspect-ratio'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { useMainDrawerState, usePlayerSonglist } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { ALBUM_ARTISTS_MAX_NUMBER } from '@/utils/multipleArtists'

export function CurrentSongInfo() {
  const { currentSong } = usePlayerSonglist()
  const { closeDrawer } = useMainDrawerState()

  const imageUrl = getCoverArtUrl(currentSong.coverArt, 'song', '900')

  return (
    <div className="mr-12 hidden lg:block w-[260px] lg:w-[320px] 2xl:w-[380px]">
      <AspectRatio
        ratio={1 / 1}
        className="shadow-header-image rounded-md overflow-hidden bg-accent"
      >
        <LazyLoadImage
          id="song-info-image"
          src={imageUrl}
          effect="opacity"
          alt={`${currentSong.artist} - ${currentSong.title}`}
          className="rounded-md aspect-square object-cover text-transparent"
          width="100%"
          height="100%"
        />
      </AspectRatio>

      <div className="flex flex-col items-center justify-center mt-6 px-1">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center text-balance drop-shadow-md">
          {currentSong.albumId ? (
            <Link
              to={ROUTES.ALBUM.PAGE(currentSong.albumId)}
              className="hover:underline"
              onClick={closeDrawer}
            >
              {currentSong.title}
            </Link>
          ) : (
            <>{currentSong.title}</>
          )}
        </h4>

        <p className="leading-5 mt-1 text-foreground/70 drop-shadow-md flex items-center justify-center flex-wrap gap-1">
          <QueueArtistsLinks song={currentSong} />
        </p>
      </div>
    </div>
  )
}

function QueueArtistsLinks({ song }: { song: ISong }) {
  const { closeDrawer } = useMainDrawerState()
  const { artist, artistId, artists } = song

  if (artists && artists.length > 1) {
    const data = artists.slice(0, ALBUM_ARTISTS_MAX_NUMBER)

    return (
      <>
        {data.map(({ id, name }, index) => (
          <div key={id}>
            <ArtistLink id={id} name={name} onClick={closeDrawer} />
            {index < data.length - 1 && ','}
          </div>
        ))}
      </>
    )
  }

  return <ArtistLink id={artistId} name={artist} onClick={closeDrawer} />
}

type ArtistLinkProps = LinkWithoutTo & {
  id?: string
  name: string
}

function ArtistLink({ id, name, className, ...props }: ArtistLinkProps) {
  return (
    <Link
      className={cn(
        className,
        id ? 'hover:underline hover:text-foreground' : 'pointer-events-none',
      )}
      to={ROUTES.ARTIST.PAGE(id ?? '')}
      {...props}
    >
      {name}
    </Link>
  )
}
