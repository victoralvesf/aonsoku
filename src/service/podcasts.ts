import { QueryType } from '@/api/httpClient'
import { podcastClient } from '@/api/podcastClient'
import {
  Episode,
  EpisodeWithPodcast,
  Podcasts,
  PodcastWithEpisodes,
} from '@/types/responses/podcasts'

interface SearchParams {
  query: string
  per_page?: number
  page?: number
  filter_by?: 'title' | 'description' | 'both'
}

async function search(params: SearchParams) {
  const query: QueryType = { ...params }

  const response = await podcastClient<Podcasts>('/podcasts/search', {
    method: 'GET',
    query,
  })

  return response
}

interface GetAllParams {
  order_by?: 'title' | 'episode_count'
  sort?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

async function getAll(params?: GetAllParams) {
  const query: QueryType = { ...params }

  const response = await podcastClient<Podcasts>('/podcasts', {
    method: 'GET',
    query,
  })

  return response
}

interface ShowParams {
  order_by?: 'published_at' | 'title' | 'duration'
  sort?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

async function getOne(id: string, params?: ShowParams) {
  const query: QueryType = params ? { ...params } : {}

  const response = await podcastClient<PodcastWithEpisodes>(`/podcasts/${id}`, {
    method: 'GET',
    query,
  })

  return response
}

type CreateParams =
  | { feed_url: string; feed_urls?: never }
  | { feed_urls: string[]; feed_url?: never }

async function create(body: CreateParams) {
  const response = await podcastClient<PodcastWithEpisodes>('/podcasts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  return response
}

async function unfollow(id: string) {
  try {
    await podcastClient(`/podcasts/${id}`, {
      method: 'DELETE',
    })

    return { success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }

    return { success: false, error: 'An unexpected error occurred' }
  }
}

async function getEpisode(id: string) {
  const response = await podcastClient<EpisodeWithPodcast>(`/episodes/${id}`, {
    method: 'GET',
  })

  return response
}

async function getLatest() {
  const response = await podcastClient<Episode[]>('/episodes/latest', {
    method: 'GET',
  })

  return response
}

export const podcasts = {
  getAll,
  getOne,
  create,
  unfollow,
  search,
  getEpisode,
  getLatest,
}
