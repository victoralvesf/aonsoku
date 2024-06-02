import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import PreviewList from "@/app/components/home/preview-list";
import ImageHeader from "@/app/components/album/image-header";
import ListWrapper from "@/app/components/list-wrapper";
import PlayButtons from "@/app/components/album/play-buttons";
import { IArtist, IArtistInfo } from "@/types/responses/artist";
import { ISong } from "@/types/responses/song";
import ArtistInfo, { ArtistInfoFallback } from "@/app/components/artist/artist-info";
import ArtistTopSongs, { ArtistTopSongsFallback } from "@/app/components/artist/artist-top-songs";
import RelatedArtistsList from "@/app/components/artist/related-artists";
import PreviewListFallback from "@/app/components/preview-list-fallback";
import { subsonic } from "@/service/subsonic";
import { usePlayer } from "@/app/contexts/player-context";
import { ROUTES } from "@/routes/routesList";
import { useTranslation } from "react-i18next";

interface ILoaderData {
  artist: IArtist
  artistInfo: Promise<IArtistInfo>
  topSongs: Promise<ISong[]>
}

export default function Artist() {
  const player = usePlayer()
  const { t } = useTranslation()
  const { artist, artistInfo, topSongs } = useLoaderData() as ILoaderData
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

  const badges = [
    formatAlbumCount(),
    getSongCount()
  ]

  async function handlePlayArtistRadio(shuffle = false) {
    const response = await subsonic.search.get({
      query: artist.name,
      songCount: artistSongCount,
      albumCount: 0,
      artistCount: 0
    })

    if (response?.song) {
      player.setSongList(response.song, 0, shuffle)
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
        />

        <Suspense fallback={<ArtistInfoFallback />}>
          <Await resolve={artistInfo} errorElement={<></>}>
            <ArtistInfo artistName={artist.name} />
          </Await>
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