import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { AspectRatio } from '@/app/components/ui/aspect-ratio'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions, usePlayerSonglist } from '@/store/player.store'

export function CurrentSongInfo() {
  const { currentSong } = usePlayerSonglist()
  const { setQueueDrawerState } = usePlayerActions()

  const currentSongIsDefined = Object.keys(currentSong).length > 0

  if (!currentSongIsDefined) {
    return (
      <div className="mr-12 hidden lg:block w-[260px] lg:w-[320px] 2xl:w-[380px]">
        <div className="bg-background w-full aspect-square rounded-md" />
      </div>
    )
  }

  const imageUrl = getCoverArtUrl(currentSong.coverArt, '400')

  return (
    <div className="mr-12 hidden lg:block w-[260px] lg:w-[320px] 2xl:w-[380px]">
      <AspectRatio ratio={1 / 1}>
        <LazyLoadImage
          src={imageUrl}
          effect="opacity"
          alt={`${currentSong.artist} - ${currentSong.title}`}
          className="rounded-md aspect-square object-cover"
        />
      </AspectRatio>

      <div className="flex flex-col items-center justify-center mt-6 px-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center">
          {currentSong.albumId ? (
            <Link
              to={ROUTES.ALBUM.PAGE(currentSong.albumId)}
              className="hover:underline"
              onClick={() => setQueueDrawerState(false)}
            >
              {currentSong.title}
            </Link>
          ) : (
            <>{currentSong.title}</>
          )}
        </h4>

        <p className="leading-7 text-muted-foreground">
          {currentSong.artistId ? (
            <Link
              to={ROUTES.ARTIST.PAGE(currentSong.artistId)}
              className="hover:underline"
              onClick={() => setQueueDrawerState(false)}
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
