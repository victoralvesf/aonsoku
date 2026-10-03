import { ChevronRight, Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ImageLoader } from '@/app/components/image-loader'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { useAppStore } from '@/store/app.store'
import { ISong } from '@/types/responses/song'

interface FavoritePlaylistCardProps {
  songs: ISong[]
  artistId: string
  artistName: string
  artistCoverArtId?: string
  className?: string
}

export function FavoritePlaylistCard({
  songs,
  artistId,
  artistName,
  artistCoverArtId,
  className,
}: FavoritePlaylistCardProps) {
  const { t } = useTranslation()
  const hideFavoritesSection = useAppStore().pages.hideFavoritesSection

  if (hideFavoritesSection) return null
  if (songs.length === 0) return null

  const coverArtId = songs[0].coverArt || artistCoverArtId
  const to = `${ROUTES.FAVORITES.PAGE}?artistId=${encodeURIComponent(artistId)}&artistName=${encodeURIComponent(artistName)}`

  return (
    <Link
      to={to}
      data-testid="favorite-playlist-card"
      className={cn(
        'group flex items-center gap-4 w-fit max-w-full self-start',
        'p-2 pr-4 rounded-lg border border-border/60 bg-foreground/[0.03]',
        'hover:bg-foreground/10 hover:border-border transition-colors duration-200',
        className,
      )}
    >
      <div className="relative shrink-0">
        <div className="w-14 h-14 rounded-md overflow-hidden shadow-md bg-gradient-to-br from-red-500/40 to-primary/30">
          <ImageLoader id={coverArtId} type="album" size="150">
            {(src) =>
              src ? (
                <img
                  src={src}
                  alt={t('favorites.inYourLibrary')}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : null
            }
          </ImageLoader>
        </div>
        <div
          className="absolute -bottom-1.5 -right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-background shadow-sm"
          data-testid="favorite-playlist-card-badge"
        >
          <Heart
            className="w-3.5 h-3.5 text-red-500 fill-red-500"
            strokeWidth={2}
          />
        </div>
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <span
          className="font-semibold text-sm leading-tight truncate"
          data-testid="favorite-playlist-card-title"
        >
          {t('favorites.inYourLibrary')}
        </span>
        <span
          className="text-xs text-muted-foreground leading-tight truncate"
          data-testid="favorite-playlist-card-count"
        >
          {t('playlist.songCount', { count: songs.length })}
        </span>
      </div>

      <ChevronRight className="w-4 h-4 ml-2 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
    </Link>
  )
}
