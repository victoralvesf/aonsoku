import ImageHeader from "@/app/components/image-header";
import { Badge } from "@/app/components/ui/badge";
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
        coverArtSize="350"
        coverArtAlt={artist.name}
      >
        <>
          {badges.map((badge) => (
            <>
              {badge !== null && <Badge variant="secondary">{badge}</Badge>}
            </>
          ))}
        </>
      </ImageHeader>
    </div>
  )
}