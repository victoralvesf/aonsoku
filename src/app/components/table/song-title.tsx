import { Link } from 'react-router-dom'
import { CoverImage } from '@/app/components/table/cover-image'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { useMainDrawerState } from '@/store/player.store'
import { ISong } from '@/types/responses/song'

export function TableSongTitle({ song }: { song: ISong }) {
  return (
    <div className="flex w-full gap-2 items-center">
      <CoverImage
        coverArt={song.coverArt}
        coverArtType="song"
        altText={song.title}
      />
      <div className="flex flex-col w-full justify-center truncate">
        <SimpleTooltip text={song.title} delay={1000}>
          <span className="block w-fit max-w-full font-medium truncate">
            {song.title}
          </span>
        </SimpleTooltip>
        <div className="flex items-center truncate">
          <TableArtists song={song} />
        </div>
      </div>
    </div>
  )
}

type ArtistsLinksProps = {
  song: ISong
}

export function TableArtists({ song }: ArtistsLinksProps) {
  const { artists, artistId, artist } = song

  if (artists && artists.length > 1) {
    return <ArtistsLinks song={song} />
  }

  if (!artistId) {
    return (
      <SimpleTooltip text={artist} delay={1000}>
        <span className="text-xs text-foreground/70 text-nowrap">{artist}</span>
      </SimpleTooltip>
    )
  }

  return <ArtistLink id={artistId} name={artist} />
}

function ArtistsLinks({ song }: ArtistsLinksProps) {
  const { artists, artistId, artist } = song

  if (artists && artists.length > 1) {
    const artistNames = artists.map(({ name }) => name).join(', ')

    return (
      <div className="flex items-center w-full maskImage-marquee-fade-finished">
        <SimpleTooltip text={artistNames} delay={1000}>
          <div className="flex items-center gap-1 max-w-full text-xs text-foreground/70">
            {artists.map(({ id, name }, index) => (
              <div key={id} className="flex items-center">
                <ArtistLink id={id} name={name} disableTooltip />
                {index < artists.length - 1 && ','}
              </div>
            ))}
          </div>
        </SimpleTooltip>
      </div>
    )
  }

  return <ArtistLink id={artistId} name={artist} />
}

type ArtistLinkProps = {
  id?: string
  name: string
  disableTooltip?: boolean
}

function ArtistLink({ id, name, disableTooltip = false }: ArtistLinkProps) {
  const { mainDrawerState, closeDrawer } = useMainDrawerState()

  return (
    <Link
      to={ROUTES.ARTIST.PAGE(id ?? '')}
      className={cn('w-fit inline-flex', !id && 'pointer-events-none')}
      data-testid="track-artist-url"
      onClick={() => {
        if (mainDrawerState) closeDrawer()
      }}
    >
      <SimpleTooltip text={name} delay={1000} disabled={disableTooltip}>
        <span
          className={cn(
            'text-xs text-foreground/70 text-nowrap',
            id && 'hover:underline hover:text-foreground',
          )}
        >
          {name}
        </span>
      </SimpleTooltip>
    </Link>
  )
}
