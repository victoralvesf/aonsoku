import { Link } from 'react-router-dom'
import { CoverImage } from '@/app/components/table/cover-image.tsx'
import { ROUTES } from '@/routes/routesList.ts'
import { ISimilarArtist } from '@/types/responses/artist.ts'

type ArtistTitleProps = {
  artist: ISimilarArtist
}

export function ArtistTitle({ artist }: ArtistTitleProps) {
  return (
    <div className="flex gap-2 items-center min-w-[200px] 2xl:min-w-[350px]">
      <CoverImage
        coverArt={artist.coverArt}
        coverArtType="artist"
        altText={artist.name}
      />
      <div className="flex flex-col justify-center items-center">
        <Link
          to={ROUTES.ARTIST.PAGE(artist.id)}
          className="hover:underline flex w-fit"
        >
          <p>{artist.name}</p>
        </Link>
      </div>
    </div>
  )
}
