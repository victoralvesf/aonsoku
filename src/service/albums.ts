import { httpClient } from "@/api/httpClient";
import { AlbumListResponse, GetAlbumResponse } from "@/types/responses/album";

interface AlbumListParams {
  size?: string
  type: 'random' | 'newest' | 'highest' | 'frequent' | 'recent'
  offset?: string
  fromYear?: string
  toYear?: string
  genre?: string
}

async function getAlbumList(params: Partial<AlbumListParams> = {}) {
  const {
    type = 'newest',
    size = '30',
    offset = '0',
    fromYear,
    toYear,
    genre
  } = params

  const response = await httpClient<AlbumListResponse>('/getAlbumList', {
    method: 'GET',
    query: {
      type,
      size,
      offset,
      fromYear,
      toYear,
      genre
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
  getAlbumList,
  getOne
}