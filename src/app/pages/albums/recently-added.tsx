import { getCoverArtUrl } from '@/api/httpClient';
import { Album } from '@/types/responses/album';
import { useLoaderData } from 'react-router-dom';

export default function RecentlyAddedAlbums() {
  const recentSongs = useLoaderData() as Album[];

  return (
    <main>
      <div className="space-y-1 mb-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Recently Added Albums
        </h2>
      </div>
      {recentSongs.map((album) => (
        <div key={album.id}>
          <img src={getCoverArtUrl(album.coverArt)} alt={album.title} />
          <span>{album.title}</span>
          <p>{album.artist}</p>
        </div>
      ))}
    </main>
  )
}