import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import ArtistInfo, { ArtistInfoFallback } from "@/app/components/artist/artist-info";
import PreviewList from "@/app/components/home/preview-list";
import ImageHeader from "@/app/components/album/image-header";
import ListWrapper from "@/app/components/list-wrapper";
import PlayButtons from "@/app/components/album/play-buttons";
import { IArtist, IArtistInfo } from "@/types/responses/artist";
import { ISong } from "@/types/responses/song";
import ArtistTopSongs, { ArtistTopSongsFallback } from "@/app/components/artist/artist-top-songs";
import { subsonic } from "@/service/subsonic";
import { usePlayer } from "@/app/contexts/player-context";

interface ILoaderData {
  artist: IArtist
  artistInfo: Promise<IArtistInfo>
  topSongs: Promise<ISong[]>
}

export default function Artist() {
  const player = usePlayer()
  const { artist, artistInfo, topSongs } = useLoaderData() as ILoaderData
  let artistSongCount = 0

  function getSongCount() {
    if (artist?.albumCount === undefined) return null
    if (artist?.albumCount === 0) return null

    artist.album.forEach((album) => {
      artistSongCount += album.songCount
    })

    let songCount = `${artistSongCount} song`
    if (artistSongCount > 1) songCount += 's'

    return songCount
  }

  function formatAlbumCount() {
    if (artist?.albumCount === undefined) return null

    let albumCount = `${artist.albumCount} album`
    if (artist.albumCount > 1) albumCount += 's'
    return albumCount
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

  return (
    <div className="w-full">
      <ImageHeader
        type="Artist"
        title={artist.name}
        coverArtId={artist.coverArt}
        coverArtSize="700"
        coverArtAlt={artist.name}
        badges={badges}
      />

      <ListWrapper>
        <PlayButtons
          playButtonTooltip={`Play ${artist.name} radio`}
          handlePlayButton={() => handlePlayArtistRadio()}
          shuffleButtonTooltip={`Play ${artist.name} radio in shuffle mode`}
          handleShuffleButton={() => handlePlayArtistRadio(true)}
          optionsTooltip={`More options for ${artist.name}`}
          showLikeButton={true}
          likeButtonTooltip={`Like ${artist.name}`}
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
          title="Recent Albums"
          list={artist.album}
          moreTitle="Artist Discography"
          moreRoute="/kk"
        />
      </ListWrapper>
    </div>
  )
}