import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ImageHeader from '@/app/components/album/image-header'
import ArtistTopSongs from '@/app/components/artist/artist-top-songs'
import { ArtistInfo } from '@/app/components/artist/info'
import RelatedArtistsList from '@/app/components/artist/related-artists'
import { AlbumFallback } from '@/app/components/fallbacks/album-fallbacks'
import { PreviewListFallback } from '@/app/components/fallbacks/home-fallbacks'
import { TopSongsTableFallback } from '@/app/components/fallbacks/table-fallbacks'
import { BadgesData } from '@/app/components/header-info'
import PreviewList from '@/app/components/home/preview-list'
import ListWrapper from '@/app/components/list-wrapper'
import {
  useGetArtist,
  useGetArtistInfo,
  useGetTopSongs,
} from '@/app/hooks/use-artist'
import ErrorPage from '@/app/pages/error-page'
import { ROUTES } from '@/routes/routesList'
import { sortRecentAlbums } from '@/utils/album'

export default function Artist() {
  const { t } = useTranslation()
  const { artistId } = useParams() as { artistId: string }

  const {
    data: artist,
    isLoading: artistIsLoading,
    isFetched,
  } = useGetArtist(artistId)
  const { data: artistInfo, isLoading: artistInfoIsLoading } =
    useGetArtistInfo(artistId)
  const { data: topSongs, isLoading: topSongsIsLoading } = useGetTopSongs(
    artist?.name,
  )

  if (artistIsLoading) return <AlbumFallback />
  if (isFetched && !artist) {
    return <ErrorPage status={404} statusText="Not Found" />
  }
  if (!artist) return <AlbumFallback />

  function getSongCount() {
    if (!artist) return null
    if (artist.albumCount === undefined) return null
    if (artist.albumCount === 0) return null
    if (!artist.album) return null
    let artistSongCount = 0

    artist.album.forEach((album) => {
      artistSongCount += album.songCount
    })

    return t('playlist.songCount', { count: artistSongCount })
  }

  function formatAlbumCount() {
    if (!artist) return null
    if (artist.albumCount === undefined) return null
    if (artist.albumCount === 0) return null

    return t('artist.info.albumsCount', { count: artist.albumCount })
  }

  const albumCount = formatAlbumCount()
  const songCount = getSongCount()

  const badges: BadgesData = [
    {
      content: albumCount,
      type: 'link',
      link: ROUTES.ALBUMS.ARTIST(artist.id, artist.name),
    },
    {
      content: songCount,
      type: 'link',
      link: ROUTES.SONGS.ARTIST_TRACKS(artist.id, artist.name),
    },
  ]

  const recentAlbums = artist.album ? sortRecentAlbums(artist.album) : []

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
        <ArtistInfo artist={artist} />

        {topSongsIsLoading && <TopSongsTableFallback />}
        {topSongs && !topSongsIsLoading && (
          <ArtistTopSongs topSongs={topSongs} artist={artist} />
        )}

        {recentAlbums.length > 0 && (
          <PreviewList
            title={t('artist.recentAlbums')}
            list={recentAlbums}
            moreTitle={t('album.more.discography')}
            moreRoute={ROUTES.ALBUMS.ARTIST(artist.id, artist.name)}
          />
        )}

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
