import { useLayoutEffect, useState } from 'react';
import { httpClient } from '../api/httpClient';
import { AlbumListResponse } from '../types/responses/album';

export default function RecentlyAddedAlbums() {
  const [recentSongs, setRecentSongs] = useState({})

  async function getRecentSongs() {
    const response = await httpClient<AlbumListResponse>('/getAlbumList', {
      method: 'GET',
      query: {
        type: 'newest',
        size: '30',
        offset: '0'
      }
    })

    if (response !== undefined) {
      console.log(response.albumList.album)

      setRecentSongs(response.albumList.album)
    }
  }

  useLayoutEffect(() => {
    // getRecentSongs()
    console.log('opa kkk')
  }, [])

  return (
    <main>
      <h1>Recent Albums</h1>
    </main>
  )
}