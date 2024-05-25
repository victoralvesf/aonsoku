import { httpClient } from "@/api/httpClient";
import { AlbumListResponse, GetAlbumResponse } from "@/types/responses/album";

async function getRecentlyAdded(size = '30') {
  const response = await httpClient<AlbumListResponse>('/getAlbumList', {
    method: 'GET',
    query: {
      type: 'newest',
      size,
      offset: '0'
    }
  })

  return response?.albumList.album
}

async function getOne(id: string) {
  const response = await httpClient<GetAlbumResponse>('/getAlbum', {
    method: 'GET',
    query: {
      id
    }
  })

  return response?.album
}

export const albums = {
  getRecentlyAdded,
  getOne
}