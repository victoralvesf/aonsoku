import { httpClient } from '@/api/httpClient'
import { ILovedSongsResponse } from '@/types/responses/lovedsongs'

export interface SearchQueryOptions {
  query?: string
  artistCount?: number
  artistOffset?: number
  albumCount?: number
  albumOffset?: number
  songCount?: number
  songOffset?: number
}

async function get({
  query = '',
  artistCount = 20,
  artistOffset = 0,
  albumCount = 20,
  albumOffset = 0,
  songCount = 20,
  songOffset = 0,
}: SearchQueryOptions) {
  const response = await httpClient<ILovedSongsResponse>('/getStarred2', {
    method: 'GET',
  })
  return response?.data.starred2
}

export const lovedsongs = {
  get,
}
