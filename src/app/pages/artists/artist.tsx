/* eslint-disable react/no-children-prop */
import { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Await, useLoaderData } from 'react-router-dom'
import ImageHeader from '@/app/components/album/image-header'
import InfoPanel, { InfoPanelFallback } from '@/app/components/album/info-panel'
import PlayButtons from '@/app/components/album/play-buttons'
import ArtistTopSongs, {
  ArtistTopSongsFallback,
} from '@/app/components/artist/artist-top-songs'
import { ArtistOptions } from '@/app/components/artist/options'
import RelatedArtistsList from '@/app/components/artist/related-artists'
import PreviewList from '@/app/components/home/preview-list'
import ListWrapper from '@/app/components/list-wrapper'
import PreviewListFallback from '@/app/components/preview-list-fallback'
import { useSongList } from '@/app/hooks/use-song-list'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { IArtist, IArtistInfo } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'

interface ILoaderData {
  artist: IArtist
  artistInfo: Promise<IArtistInfo>
  topSongs: Promise<ISong[]>
}

export default function Artist() {
  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()
  const { artist, artistInfo, topSongs } = useLoaderData() as ILoaderData
  const { getArtistAllSongs } = useSongList()
  let artistSongCount = 0

  function getSongCount() {
    if (artist?.albumCount === undefined) return null
    if (artist?.albumCount === 0) return null

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
    const songList = await getArtistAllSongs(artist.name)

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

        <Suspense fallback={<InfoPanelFallback />}>
          <Await
            resolve={artistInfo}
            errorElement={<></>}
            children={(info: IArtistInfo) => (
              <InfoPanel
                title={artist.name}
                bio={info.biography}
                lastFmUrl={info.lastFmUrl}
                musicBrainzId={info.musicBrainzId}
              />
            )}
          />
        </Suspense>

        <Suspense fallback={<ArtistTopSongsFallback />}>
          <Await resolve={topSongs} errorElement={<></>}>
            <ArtistTopSongs />
          </Await>
        </Suspense>

        <PreviewList
          title={t('artist.recentAlbums')}
          list={artist.album}
          moreTitle={t('album.more.discography')}
          moreRoute={ROUTES.ARTIST.ALBUMS(artist.id)}
        />

        <Suspense fallback={<PreviewListFallback />}>
          <Await resolve={artistInfo} errorElement={<></>}>
            <RelatedArtistsList title={t('artist.relatedArtists')} />
          </Await>
        </Suspense>
      </ListWrapper>
    </div>
  )
}
