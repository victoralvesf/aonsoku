import PreviewList from "@/app/components/home/preview-list";
import ImageHeader from "@/app/components/image-header";
import ListWrapper from "@/app/components/list-wrapper";
import PlayButtons from "@/app/components/play-buttons";
import { IArtist } from "@/types/responses/artist";
import { useLoaderData } from "react-router-dom";

export default function Artist() {
  const artist = useLoaderData() as IArtist

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