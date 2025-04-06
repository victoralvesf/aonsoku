import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { getCoverArtUrl } from '@/api/httpClient'
import { PreviewCard } from '@/app/components/preview-card/card'
import { useSongList } from '@/app/hooks/use-song-list'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ISimilarArtist } from '@/types/responses/artist'

type ArtistCardProps = {
  artist: ISimilarArtist
}

function ArtistCard({ artist }: ArtistCardProps) {
  const { t } = useTranslation()
  const { getArtistAllSongs } = useSongList()
  const { setSongList } = usePlayerActions()

  const handlePlayArtistRadio = useCallback(async () => {
    const songList = await getArtistAllSongs(artist.name)

    if (songList) {
      setSongList(songList, 0)
    }
  }, [artist.name, getArtistAllSongs, setSongList])

  return (
    <PreviewCard.Root className="flex flex-col w-full h-full">
      <PreviewCard.ImageWrapper link={ROUTES.ARTIST.PAGE(artist.id)}>
        <PreviewCard.Image
          src={getCoverArtUrl(artist.coverArt, 'artist')}
          alt={artist.name}
        />
        <PreviewCard.PlayButton onClick={handlePlayArtistRadio} />
      </PreviewCard.ImageWrapper>
      <PreviewCard.InfoWrapper>
        <PreviewCard.Title link={ROUTES.ARTIST.PAGE(artist.id)}>
          {artist.name}
        </PreviewCard.Title>
        <PreviewCard.Subtitle enableLink={false}>
          {t('artist.info.albumsCount', {
            count: artist.albumCount,
          })}
        </PreviewCard.Subtitle>
      </PreviewCard.InfoWrapper>
    </PreviewCard.Root>
  )
}

export const ArtistGridCard = memo(ArtistCard)
