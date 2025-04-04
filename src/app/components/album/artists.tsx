import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { Dot } from '@/app/components/dot'
import { ROUTES } from '@/routes/routesList'
import { IFeaturedArtist } from '@/types/responses/artist'
import { ALBUM_ARTISTS_MAX_NUMBER } from '@/utils/multipleArtists'
import { checkServerType } from '@/utils/servers'

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
  const data = artists.slice(0, ALBUM_ARTISTS_MAX_NUMBER)
  const { isLms } = checkServerType()

  return (
    <div className="flex items-center gap-2">
      {!isLms && (
        <div className="flex items-center -space-x-0.5">
          {data.map(({ id, name }) => (
            <div key={`artist-image-${id}`} className="rounded-full">
              <ArtistImage id={id} name={name} />
            </div>
          ))}
        </div>
      )}
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
  const { isLms } = checkServerType()

  // LMS server (https://github.com/epoupon/lms) does not support
  // retrieving artist images using the artist's own ID.
  if (isLms) return null

  return (
    <div className="size-6 min-w-6 min-h-6 rounded-full bg-accent drop-shadow-lg ring-1 ring-foreground/10">
      <LazyLoadImage
        effect="opacity"
        src={getCoverArtUrl(id, 'artist', '100')}
        alt={name}
        className="w-full h-full rounded-full aspect-square object-cover shadow-custom-5"
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
