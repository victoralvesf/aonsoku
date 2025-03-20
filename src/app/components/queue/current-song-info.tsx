import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { AspectRatio } from '@/app/components/ui/aspect-ratio'
import { ROUTES } from '@/routes/routesList'
import { useMainDrawerState, usePlayerSonglist } from '@/store/player.store'

export function CurrentSongInfo() {
  const { currentSong } = usePlayerSonglist()
  const { closeDrawer } = useMainDrawerState()

  const imageUrl = getCoverArtUrl(currentSong.coverArt, 'song', '900')

  return (
    <div className="mr-12 hidden lg:block w-[260px] lg:w-[320px] 2xl:w-[380px]">
      <AspectRatio ratio={1 / 1} className="shadow-header-image rounded-md">
        <LazyLoadImage
          id="song-info-image"
          src={imageUrl}
          effect="opacity"
          alt={`${currentSong.artist} - ${currentSong.title}`}
          className="rounded-md aspect-square object-cover bg-background text-transparent"
          width="100%"
          height="100%"
        />
      </AspectRatio>

      <div className="flex flex-col items-center justify-center mt-6 px-4">
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

        <p className="leading-7 text-foreground/70 drop-shadow-md">
          {currentSong.artistId ? (
            <Link
              to={ROUTES.ARTIST.PAGE(currentSong.artistId)}
              className="hover:underline"
              onClick={closeDrawer}
            >
              {currentSong.artist}
            </Link>
          ) : (
            <>{currentSong.artist}</>
          )}
        </p>
      </div>
    </div>
  )
}
