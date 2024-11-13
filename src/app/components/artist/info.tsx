import { Fragment } from 'react/jsx-runtime'
import { CollapsibleInfo } from '@/app/components/info/collapsible-info'
import { useGetArtistInfo } from '@/app/hooks/use-artist'
import { IArtist } from '@/types/responses/artist'
import { ArtistButtons } from './buttons'

interface ArtistInfoProps {
  artist: IArtist
}

export function ArtistInfo({ artist }: ArtistInfoProps) {
  const { data: artistInfo } = useGetArtistInfo(artist.id)

  const hasInfoToShow =
    artistInfo !== undefined && artistInfo.biography !== undefined

  return (
    <Fragment>
      <ArtistButtons artist={artist} showInfoButton={hasInfoToShow} />

      {hasInfoToShow && (
        <CollapsibleInfo
          title={artist.name}
          bio={artistInfo.biography}
          lastFmUrl={artistInfo.lastFmUrl}
          musicBrainzId={artistInfo.musicBrainzId}
        />
      )}
    </Fragment>
  )
}
