import { httpClient } from '@/api/httpClient'
import {
  AlbumInfoResponse,
  AlbumListResponse,
  AlbumListType,
  GetAlbumResponse,
} from '@/types/responses/album'

interface AlbumListParams {
  type: AlbumListType
  size?: number
  offset?: number
  fromYear?: string
  toYear?: string
  genre?: string
}

async function getAlbumList(params: Partial<AlbumListParams> = {}) {
  const {
    type = 'newest',
    size = 30,
    offset = 0,
    fromYear,
    toYear,
    genre,
  } = params

  const response = await httpClient<AlbumListResponse>('/getAlbumList', {
    method: 'GET',
    query: {
      type,
      size: size.toString(),
      offset: offset.toString(),
      fromYear,
      toYear,
      genre,
    },
  })

  return {
    albumsCount: response?.count,
    list: response?.data.albumList.album,
  }
}

async function getOne(id: string) {
  const response = await httpClient<GetAlbumResponse>('/getAlbum', {
    method: 'GET',
    query: {
      id,
    },
  })

  return response?.data.album
}

async function getInfo(id: string) {
  const response = await httpClient<AlbumInfoResponse>('/getAlbumInfo', {
    method: 'GET',
    query: {
      id,
    },
  })

  return response?.data.albumInfo
}

export const albums = {
  getAlbumList,
  getOne,
  getInfo,
}
