import { podcasts } from '@/service/podcasts'

const emptyResponse = { podcasts: [], nextOffset: null }

interface GetAllParams {
  order_by: 'title' | 'episode_count'
  sort: 'asc' | 'desc'
  per_page: number
  page: number
}

export async function getPodcastList(params: GetAllParams) {
  const response = await podcasts.getAll(params)

  if (!response) return emptyResponse
  if (!response.data) return emptyResponse

  let nextOffset = null
  if (response.next_page_url !== null) {
    nextOffset = params.page + 1
  }

  return {
    podcasts: response.data,
    nextOffset,
  }
}

export async function getPodcast(id: string) {
  const response = await podcasts.getOne(id)

  if (!response) return null
  if (!response.podcast) return null

  return response.podcast
}

interface GetOneParams {
  order_by: 'published_at' | 'title' | 'duration'
  sort: 'asc' | 'desc'
  per_page: number
  page: number
}

const emptyEpisodeResponse = { episodes: [], nextOffset: null }

export async function getPodcastEpisodes(id: string, params: GetOneParams) {
  const response = await podcasts.getOne(id, params)

  if (!response) return emptyEpisodeResponse
  if (!response.episodes.data) return emptyEpisodeResponse

  let nextOffset = null
  if (response.episodes.next_page_url !== null) {
    nextOffset = params.page + 1
  }

  return {
    episodes: response.episodes.data,
    nextOffset,
  }
}
