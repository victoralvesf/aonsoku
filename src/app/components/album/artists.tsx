import clsx from 'clsx'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { Dot } from '@/app/components/dot'
import { ROUTES } from '@/routes/routesList'
import { IFeaturedArtist } from '@/types/responses/artist'

type AlbumArtistProps = {
  id: string
  name: string
}

export function AlbumArtistInfo({ id, name }: AlbumArtistProps) {
  return (
    <div className="flex items-center gap-2">
      <ArtistImage id={id} name={name} />
      <ArtistLink id={id} name={name} />
    </div>
  )
}

type MultipleArtistsInfoProps = { artists: IFeaturedArtist[] }

export function AlbumMultipleArtistsInfo({
  artists,
}: MultipleArtistsInfoProps) {
  const data = artists.slice(0, 4)

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center relative">
        {data.map(({ id, name }, index) => (
          <div
            key={`artist-image-${id}`}
            className={clsx('rounded-full', index > 0 && '-ml-1.5')}
            style={{ zIndex: index + 1 }}
          >
            <ArtistImage id={id} name={name} />
          </div>
        ))}
      </div>
      <div className="flex items-center">
        {data.map(({ id, name }, index) => (
          <div className="flex" key={`artist-link-${id}`}>
            <ArtistLink id={id} name={name} />
            {index < data.length - 1 && <Dot />}
          </div>
        ))}
      </div>
    </div>
  )
}

function ArtistImage({ id, name }: AlbumArtistProps) {
  return (
    <div className="min-w-6 w-6 min-h-6 h-6 rounded-full bg-accent drop-shadow-lg">
      <LazyLoadImage
        effect="opacity"
        src={getCoverArtUrl(id, 'artist', '100')}
        alt={name}
        className="w-full h-full rounded-full aspect-square object-cover"
      />
    </div>
  )
}

function ArtistLink({ id, name }: AlbumArtistProps) {
  return (
    <Link
      className="flex items-center hover:underline text-sm font-medium drop-shadow"
      to={ROUTES.ARTIST.PAGE(id)}
    >
      {name}
    </Link>
  )
}
