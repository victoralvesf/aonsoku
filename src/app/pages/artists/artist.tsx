import { useQuery } from '@tanstack/react-query'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import ImageHeader from '@/app/components/album/image-header'
import InfoPanel, { InfoPanelFallback } from '@/app/components/album/info-panel'
import ArtistTopSongs from '@/app/components/artist/artist-top-songs'
import { ArtistButtons } from '@/app/components/artist/buttons'
import RelatedArtistsList from '@/app/components/artist/related-artists'
import { AlbumFallback } from '@/app/components/fallbacks/album-fallbacks'
import { PreviewListFallback } from '@/app/components/fallbacks/home-fallbacks'
import { TopSongsTableFallback } from '@/app/components/fallbacks/table-fallbacks'
import PreviewList from '@/app/components/home/preview-list'
import ListWrapper from '@/app/components/list-wrapper'
import { Badge } from '@/app/components/ui/badge'
import ErrorPage from '@/app/pages/error-page'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { queryKeys } from '@/utils/queryKeys'

export default function Artist() {
  const { t } = useTranslation()
  const { artistId } = useParams() as { artistId: string }

  const {
    data: artist,
    isLoading: artistIsLoading,
    isFetched,
  } = useQuery({
    queryKey: [queryKeys.artist.single, artistId],
    queryFn: () => subsonic.artists.getOne(artistId),
    enabled: !!artistId,
  })

  const { data: artistInfo, isLoading: artistInfoIsLoading } = useQuery({
    queryKey: [queryKeys.artist.info, artistId],
    queryFn: () => subsonic.artists.getInfo(artistId),
    enabled: !!artistId,
  })

  const { data: topSongs, isLoading: topSongsIsLoading } = useQuery({
    queryKey: [queryKeys.artist.topSongs, artist?.name],
    queryFn: () => subsonic.songs.getTopSongs(artist?.name || ''),
    enabled: !!artist?.name,
  })

  if (artistIsLoading) return <AlbumFallback />
  if (isFetched && !artist) {
    return <ErrorPage status={404} statusText="Not Found" />
  }
  if (!artist) return <AlbumFallback />

  function getSongCount() {
    if (artist?.albumCount === undefined) return null
    if (artist?.albumCount === 0) return null
    let artistSongCount = 0

    artist.album.forEach((album) => {
      artistSongCount += album.songCount
    })

    return t('playlist.songCount', { count: artistSongCount })
  }

  function formatAlbumCount() {
    if (artist?.albumCount === undefined) return null

    return t('artist.info.albumsCount', { count: artist.albumCount })
  }

  const albumCount = formatAlbumCount()
  const songCount = getSongCount()

  const badges = (
    <Fragment>
      {albumCount && (
        <Link
          to={ROUTES.ALBUMS.ARTIST(artist.id, artist.name)}
          className="flex"
        >
          <Badge variant="secondary">{albumCount}</Badge>
        </Link>
      )}
      {songCount && <Badge variant="secondary">{songCount}</Badge>}
    </Fragment>
  )

  const recentAlbums = artist.album.sort((a, b) => b.year - a.year)

  return (
    <div className="w-full">
      <ImageHeader
        type={t('artist.headline')}
        title={artist.name}
        coverArtId={artist.coverArt}
        coverArtType="artist"
        coverArtSize="700"
        coverArtAlt={artist.name}
        badges={badges}
      />

      <ListWrapper>
        <ArtistButtons artist={artist} />

        {artistInfoIsLoading && <InfoPanelFallback />}
        {artistInfo && !artistInfoIsLoading && (
          <InfoPanel
            title={artist.name}
            bio={artistInfo.biography}
            lastFmUrl={artistInfo.lastFmUrl}
            musicBrainzId={artistInfo.musicBrainzId}
          />
        )}

        {topSongsIsLoading && <TopSongsTableFallback />}
        {topSongs && !topSongsIsLoading && (
          <ArtistTopSongs topSongs={topSongs} />
        )}

        <PreviewList
          title={t('artist.recentAlbums')}
          list={recentAlbums}
          moreTitle={t('album.more.discography')}
          moreRoute={ROUTES.ALBUMS.ARTIST(artist.id, artist.name)}
        />

        {artistInfoIsLoading && <PreviewListFallback />}
        {artistInfo?.similarArtist && !artistInfoIsLoading && (
          <RelatedArtistsList
            title={t('artist.relatedArtists')}
            similarArtists={artistInfo.similarArtist}
          />
        )}
      </ListWrapper>
    </div>
  )
}
