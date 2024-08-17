import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import ImageHeader from '@/app/components/album/image-header'
import InfoPanel, { InfoPanelFallback } from '@/app/components/album/info-panel'
import PlayButtons from '@/app/components/album/play-buttons'
import ArtistTopSongs from '@/app/components/artist/artist-top-songs'
import { ArtistOptions } from '@/app/components/artist/options'
import RelatedArtistsList from '@/app/components/artist/related-artists'
import { AlbumFallback } from '@/app/components/fallbacks/album-fallbacks'
import { PreviewListFallback } from '@/app/components/fallbacks/home-fallbacks'
import { TopSongsTableFallback } from '@/app/components/fallbacks/table-fallbacks'
import PreviewList from '@/app/components/home/preview-list'
import ListWrapper from '@/app/components/list-wrapper'
import { useSongList } from '@/app/hooks/use-song-list'
import ErrorPage from '@/app/pages/error-page'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'

export default function Artist() {
  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()
  const { artistId } = useParams() as { artistId: string }
  const { getArtistAllSongs } = useSongList()

  const {
    data: artist,
    isLoading: artistIsLoading,
    isFetched,
  } = useQuery({
    queryKey: ['get-artist', artistId],
    queryFn: () => subsonic.artists.getOne(artistId),
    enabled: !!artistId,
  })

  const { data: artistInfo, isLoading: artistInfoIsLoading } = useQuery({
    queryKey: ['get-artist-info', artistId],
    queryFn: () => subsonic.artists.getInfo(artistId),
    enabled: !!artistId,
  })

  const { data: topSongs, isLoading: topSongsIsLoading } = useQuery({
    queryKey: ['get-artist-top-songs', artist?.name],
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

  const badges = [formatAlbumCount(), getSongCount()]

  async function handlePlayArtistRadio(shuffle = false) {
    const songList = await getArtistAllSongs(artist?.name || '')

    if (songList) {
      setSongList(songList, 0, shuffle)
    }
  }

  const buttonsTooltips = {
    play: t('artist.buttons.play', { artist: artist.name }),
    shuffle: t('artist.buttons.shuffle', { artist: artist.name }),
    options: t('artist.buttons.options', { artist: artist.name }),
  }

  return (
    <div className="w-full">
      <ImageHeader
        type={t('artist.headline')}
        title={artist.name}
        coverArtId={artist.coverArt}
        coverArtSize="700"
        coverArtAlt={artist.name}
        badges={badges}
      />

      <ListWrapper>
        <PlayButtons
          playButtonTooltip={buttonsTooltips.play}
          handlePlayButton={() => handlePlayArtistRadio()}
          shuffleButtonTooltip={buttonsTooltips.shuffle}
          handleShuffleButton={() => handlePlayArtistRadio(true)}
          optionsTooltip={buttonsTooltips.options}
          showLikeButton={true}
          likeTooltipResource={artist.name}
          likeState={artist.starred}
          contentId={artist.id}
          optionsMenuItems={<ArtistOptions artist={artist} />}
        />

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
          list={artist.album}
          moreTitle={t('album.more.discography')}
          moreRoute={ROUTES.ARTIST.ALBUMS(artist.id)}
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
