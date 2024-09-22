import { AudioLines, Maximize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import { getCoverArtUrl } from '@/api/httpClient'
import { MarqueeTitle } from '@/app/components/fullscreen/marquee-title'
import FullscreenMode from '@/app/components/fullscreen/page'
import Image from '@/app/components/image'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { ISong } from '@/types/responses/song'

export function TrackInfo({ song }: { song: ISong | undefined }) {
  const { t } = useTranslation()

  return song ? (
    <>
      <div className="group relative">
        <Image
          src={getCoverArtUrl(song.coverArt, 'song', '140')}
          width={70}
          className="rounded shadow-md"
          data-testid="track-image"
          alt={`${song.artist} - ${song.title}`}
        />
        <FullscreenMode>
          <Button
            variant="secondary"
            size="icon"
            className="cursor-pointer w-8 h-8 shadow-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity ease-in-out absolute top-1 right-1"
            data-testid="track-fullscreen-button"
          >
            <SimpleTooltip text={t('fullscreen.switchButton')}>
              <div className="w-full h-full flex items-center justify-center">
                <Maximize2 className="w-4 h-4" />
              </div>
            </SimpleTooltip>
          </Button>
        </FullscreenMode>
      </div>
      <div className="flex flex-col justify-center w-full overflow-hidden">
        <MarqueeTitle gap="mr-2">
          <Link
            to={ROUTES.ALBUM.PAGE(song.albumId)}
            className="group cursor-pointer"
          >
            <span
              className="text-sm font-medium group-hover:underline cursor-pointer"
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
              'text-xs font-regular text-muted-foreground',
              song.artistId && 'hover:underline',
            )}
          >
            {song.artist}
          </span>
        </Link>
      </div>
    </>
  ) : (
    <>
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
    </>
  )
}
