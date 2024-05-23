import { httpClient } from "@/api/httpClient";
import { AlbumListResponse } from "@/types/responses/album";

export async function getRecentlyAdded() {
  const response = await httpClient<AlbumListResponse>('/getAlbumList', {
    method: 'GET',
    query: {
      type: 'newest',
      size: '30',
      offset: '0'
    }
  })

  return response?.albumList.album
}