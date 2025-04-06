import randomCSSHexColor from '@chriscodesthings/random-css-hex-color'
import { AudioLines, Maximize2 } from 'lucide-react'
import { useCallback } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

import { getCoverArtUrl } from '@/api/httpClient'
import { MarqueeTitle } from '@/app/components/fullscreen/marquee-title'
import FullscreenMode from '@/app/components/fullscreen/page'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { useSongColor } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { getAverageColor } from '@/utils/getAverageColor'
import { logger } from '@/utils/logger'
import { ALBUM_ARTISTS_MAX_NUMBER } from '@/utils/multipleArtists'

export function TrackInfo({ song }: { song: ISong | undefined }) {
  const { t } = useTranslation()
  const { setCurrentSongColor, currentSongColor } = useSongColor()

  function getImageElement() {
    return document.getElementById('track-song-image') as HTMLImageElement
  }

  const getImageColor = useCallback(async () => {
    const img = getImageElement()
    if (!img) return

    let color = randomCSSHexColor(true)

    try {
      color = (await getAverageColor(img)).hex
      logger.info('[TrackInfo] - Getting Image Average Color', {
        color,
      })
    } catch {
      logger.error('[TrackInfo] - Unable to get image average color.')
    }

    if (color !== currentSongColor) {
      setCurrentSongColor(color)
    }
  }, [currentSongColor, setCurrentSongColor])

  function handleError() {
    const img = getImageElement()
    if (!img) return

    img.crossOrigin = null
  }

  if (!song) {
    return (
      <Fragment>
        <div className="w-[70px] h-[70px] flex justify-center items-center bg-muted rounded">
          <AudioLines data-testid="song-no-playing-icon" />
        </div>
        <div className="flex flex-col justify-center">
          <span
            className="text-sm font-medium"
            data-testid="song-no-playing-label"
          >
            {t('player.noSongPlaying')}
          </span>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div className="group relative">
        <div className="min-w-[70px] max-w-[70px] aspect-square bg-cover bg-center bg-skeleton rounded overflow-hidden shadow-md">
          <LazyLoadImage
            key={song.id}
            id="track-song-image"
            src={getCoverArtUrl(song.coverArt, 'song', '400')}
            width="100%"
            height="100%"
            crossOrigin="anonymous"
            className="aspect-square object-cover w-full h-full cursor-pointer bg-skeleton text-transparent"
            data-testid="track-image"
            alt={`${song.artist} - ${song.title}`}
            onLoad={getImageColor}
            onError={handleError}
          />
        </div>
        <FullscreenMode>
          <Button
            variant="secondary"
            size="icon"
            className="cursor-pointer w-8 h-8 shadow-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity ease-in-out absolute top-1 right-1 focus-visible:opacity-100"
            data-testid="track-fullscreen-button"
          >
            <SimpleTooltip text={t('fullscreen.switchButton')} align="start">
              <div className="w-full h-full flex items-center justify-center">
                <Maximize2 className="w-4 h-4" />
              </div>
            </SimpleTooltip>
          </Button>
        </FullscreenMode>
      </div>
      <div className="flex flex-col justify-center w-full overflow-hidden">
        <MarqueeTitle gap="mr-2">
          <Link to={ROUTES.ALBUM.PAGE(song.albumId)} tabIndex={-1}>
            <span
              className="text-sm font-medium hover:underline cursor-pointer"
              data-testid="track-title"
            >
              {song.title}
            </span>
          </Link>
        </MarqueeTitle>
        <TrackInfoArtistsLinks song={song} />
      </div>
    </Fragment>
  )
}

type TrackInfoArtistsLinksProps = {
  song: ISong
}

function TrackInfoArtistsLinks({ song }: TrackInfoArtistsLinksProps) {
  const { artists, artistId, artist } = song

  if (artists && artists.length > 1) {
    const reducedArtists = artists.slice(0, ALBUM_ARTISTS_MAX_NUMBER)

    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground w-full maskImage-marquee-fade-finished">
        {reducedArtists.map(({ id, name }, index) => (
          <div key={id} className="flex items-center">
            <ArtistLink id={id} name={name} />
            {index < reducedArtists.length - 1 && ','}
          </div>
        ))}
      </div>
    )
  }

  return <ArtistLink id={artistId} name={artist} />
}

type ArtistLinkProps = {
  id?: string
  name: string
}

function ArtistLink({ id, name }: ArtistLinkProps) {
  return (
    <Link
      to={ROUTES.ARTIST.PAGE(id ?? '')}
      className={cn('w-fit inline-flex', !id && 'pointer-events-none')}
      data-testid="track-artist-url"
    >
      <span
        className={cn(
          'text-xs text-muted-foreground text-nowrap',
          id && 'hover:underline hover:text-foreground',
        )}
      >
        {name}
      </span>
    </Link>
  )
}
