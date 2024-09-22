import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getCoverArtUrl } from '@/api/httpClient'
import { Badge } from '@/app/components/ui/badge'
import { cn } from '@/lib/utils'
import { PlaylistWithEntries } from '@/types/responses/playlist'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import { getTextSizeClass } from '@/utils/getTextSizeClass'

export function PlaylistPageHeader({
  playlist,
}: {
  playlist: PlaylistWithEntries
}) {
  const { t } = useTranslation()

  return (
    <div className="flex">
      <div className="bg-skeleton overflow-hidden rounded-lg shadow-md aspect-square resize-none min-w-[200px] w-[200px] 2xl:w-[250px] 2xl:min-w-[250px]">
        <LazyLoadImage
          src={getCoverArtUrl(playlist.coverArt, 'playlist')}
          alt={playlist.name}
          effect="opacity"
          className="aspect-square object-cover"
        />
      </div>
      <div className="ml-4 w-full flex flex-col justify-end">
        <p className="text-xs 2xl:text-sm mb-2">{t('playlist.headline')}</p>
        <h2
          className={cn(
            'scroll-m-20 font-bold tracking-tight antialiased',
            getTextSizeClass(playlist.name),
          )}
        >
          {playlist.name}
        </h2>
        <p className="text-xs 2xl:text-sm text-muted-foreground mt-2">
          {playlist.comment}
        </p>
        <div className="flex gap-1 mt-3 text-muted-foreground text-sm">
          <Badge>
            {t('playlist.songCount', {
              count: playlist.songCount,
            })}
          </Badge>
          {playlist.duration > 0 && (
            <Badge>
              {t('playlist.duration', {
                duration: convertSecondsToHumanRead(playlist.duration),
              })}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
