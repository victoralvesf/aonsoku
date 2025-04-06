import clsx from 'clsx'
import { RefAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { Dot } from '@/app/components/dot'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { IFeaturedArtist } from '@/types/responses/artist'
import { TABLE_ARTISTS_MAX_NUMBER } from '@/utils/multipleArtists'

export type LinkWithoutTo = Omit<LinkProps, 'to'> &
  RefAttributes<HTMLAnchorElement>

type ArtistLinkProps = LinkWithoutTo & {
  artistId?: string
}

export function ArtistLink({ artistId, className, ...props }: ArtistLinkProps) {
  return (
    <Link
      className={cn(
        'truncate',
        className,
        artistId ? 'hover:underline' : 'pointer-events-none',
      )}
      {...props}
      to={ROUTES.ARTIST.PAGE(artistId ?? '')}
      onContextMenu={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    />
  )
}

type ArtistsLinksProps = {
  artists: IFeaturedArtist[]
  onClickLink?: () => void
}

export function ArtistsLinks({ artists, onClickLink }: ArtistsLinksProps) {
  const data = artists.slice(0, TABLE_ARTISTS_MAX_NUMBER)
  const showThreeDots = artists.length > TABLE_ARTISTS_MAX_NUMBER

  function showDot(index: number) {
    return index < artists.length - 1
  }

  function showTitle(index: number, name: string) {
    return index > 0 ? name : undefined
  }

  return (
    <div className="flex items-center truncate">
      {data.map(({ id, name }, index) => (
        <div
          key={id}
          className={clsx('flex items-center', index > 0 && 'truncate')}
        >
          <ArtistLink
            artistId={id}
            title={showTitle(index, name)}
            onClick={() => {
              if (onClickLink) onClickLink()
            }}
          >
            {name}
          </ArtistLink>
          {showDot(index) && <Dot />}
        </div>
      ))}
      {showThreeDots && <span>...</span>}
    </div>
  )
}
