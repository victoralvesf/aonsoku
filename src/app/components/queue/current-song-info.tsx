import { useCallback, useEffect } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { AspectRatio } from '@/app/components/ui/aspect-ratio'
import { ROUTES } from '@/routes/routesList'
import {
  useMainDrawerState,
  usePlayerSonglist,
  useSongColor,
} from '@/store/player.store'
import { getAverageColor } from '@/utils/getAverageColor'
import { logger } from '@/utils/logger'

export function CurrentSongInfo() {
  const { setCurrentSongColor, useSongColorOnQueue } = useSongColor()
  const { currentSong } = usePlayerSonglist()
  const { closeDrawer } = useMainDrawerState()

  const imageUrl = getCoverArtUrl(currentSong.coverArt, 'song', '400')

  function getImageElement() {
    return document.getElementById('song-info-image') as HTMLImageElement
  }

  const getImageColor = useCallback(async () => {
    const img = getImageElement()
    if (!img) return

    let color = null

    if (!useSongColorOnQueue) {
      setCurrentSongColor(null)
      return
    }

    try {
      color = (await getAverageColor(img)).hex
      logger.info('[DrawerCurrentSongInfo] - Getting Image Average Color', {
        color,
      })
    } catch (_) {
      logger.error(
        '[DrawerCurrentSongInfo] - Unable to get image average color.',
      )
    }

    setCurrentSongColor(color)
  }, [setCurrentSongColor, useSongColorOnQueue])

  function handleError() {
    const img = getImageElement()
    if (!img) return

    img.crossOrigin = null
  }

  useEffect(() => {
    getImageColor()
  }, [currentSong.coverArt, getImageColor])

  return (
    <div className="mr-12 hidden lg:block w-[260px] lg:w-[320px] 2xl:w-[380px]">
      <AspectRatio ratio={1 / 1} className="shadow-header-image rounded-md">
        <LazyLoadImage
          id="song-info-image"
          src={imageUrl}
          effect="opacity"
          crossOrigin="anonymous"
          alt={`${currentSong.artist} - ${currentSong.title}`}
          className="rounded-md aspect-square object-cover bg-background text-transparent"
          width="100%"
          height="100%"
          onLoad={getImageColor}
          onError={handleError}
        />
      </AspectRatio>

      <div className="flex flex-col items-center justify-center mt-6 px-4">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-center text-balance">
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

        <p className="leading-7 text-foreground/70">
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
