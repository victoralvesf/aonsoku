import { Suspense } from "react";
import { Await, useLoaderData } from "react-router-dom";
import ArtistInfo, { ArtistInfoFallback } from "@/app/components/artist-info";
import PreviewList from "@/app/components/home/preview-list";
import ImageHeader from "@/app/components/image-header";
import ListWrapper from "@/app/components/list-wrapper";
import PlayButtons from "@/app/components/play-buttons";
import { IArtist, IArtistInfo } from "@/types/responses/artist";

interface ILoaderData {
  artist: IArtist
  artistInfo: Promise<IArtistInfo>
}

export default function Artist() {
  const { artist, artistInfo } = useLoaderData() as ILoaderData

  function getSongCount() {
    if (artist.albumCount === 0) return null

    let count = 0
    artist.album.forEach((album) => {
      count += album.songCount
    })

    let songCount = `${count} song`
    if (count > 1) songCount += 's'

    return songCount
  }

  function formatAlbumCount() {
    if (!artist.albumCount) return null

    let albumCount = `${artist.albumCount} album`
    if (artist.albumCount > 1) albumCount += 's'
    return albumCount
  }

  const badges = [
    formatAlbumCount(),
    getSongCount()
  ]

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
          handlePlayButton={() => console.log('haha')}
          shuffleButtonTooltip={`Play ${artist.name} radio in shuffle mode`}
          handleShuffleButton={() => console.log('haha')}
          optionsTooltip={`More options for ${artist.name}`}
          showLikeButton={true}
          likeState={artist.starred}
          contentId={artist.id}
        />

        <Suspense fallback={<ArtistInfoFallback />}>
          <Await resolve={artistInfo}>
            <ArtistInfo artistName={artist.name} />
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