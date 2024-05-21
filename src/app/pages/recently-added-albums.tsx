import { useLayoutEffect, useState } from 'react';
import { getCoverArtUrl, httpClient } from '@/api/httpClient';
import { Album, AlbumListResponse } from '@/types/responses/album';

export default function RecentlyAddedAlbums() {
  const [recentSongs, setRecentSongs] = useState<Album[]>([])

  async function getRecentSongs() {
    const response = await httpClient<AlbumListResponse>('/getAlbumList', {
      method: 'GET',
      query: {
        type: 'newest',
        size: '30',
        offset: '0'
      }
    })

    response ? setRecentSongs(response.albumList.album) : setRecentSongs([])
  }

  useLayoutEffect(() => {
    getRecentSongs()
  }, [])

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