import { QueryType } from '@/api/httpClient'
import { podcastClient } from '@/api/podcastClient'
import {
  Episode,
  Episodes,
  EpisodeWithPodcast,
  Podcast,
  Podcasts,
  PodcastWithEpisodes,
  Playback,
} from '@/types/responses/podcasts'

type PodcastOrderBy = 'title' | 'episode_count'
type EpisodeOrderBy = 'published_at' | 'title' | 'duration'
type FilterBy = 'title' | 'description' | 'both'
type Sort = 'asc' | 'desc'

interface Paginated {
  per_page?: number
  page?: number
}

export interface SearchParams extends Paginated {
  query: string
  filter_by?: FilterBy
}

export interface GetAllParams extends Paginated {
  order_by?: PodcastOrderBy
  sort?: Sort
}

export interface ShowParams extends Paginated {
  order_by?: EpisodeOrderBy
  sort?: Sort
}

export interface SearchEpisodesParams extends Paginated {
  query: string
  order_by?: EpisodeOrderBy
  filter_by?: FilterBy
  sort?: Sort
}

async function search(params: SearchParams) {
  const query: QueryType = { ...params }

  const response = await podcastClient<Podcasts>('/podcasts/search', {
    method: 'GET',
    query,
  })

  return response
}

async function getAll(params?: GetAllParams) {
  const query: QueryType = { ...params }

  const response = await podcastClient<Podcasts>('/podcasts', {
    method: 'GET',
    query,
  })

  return response
}

async function getOne(id: string, params?: ShowParams) {
  const query: QueryType = params ? { ...params } : {}

  const response = await podcastClient<PodcastWithEpisodes>(`/podcasts/${id}`, {
    method: 'GET',
    query,
  })

  return response
}

type CreateParams = { feed_url: string } | { feed_urls: string[] }
type CreateOneResponse = Promise<Podcast | null>
type CreateManyResponse = Promise<Podcast[] | null>
type CreateResponse = Promise<Podcast | Podcast[] | null>

async function create(body: { feed_url: string }): CreateOneResponse
async function create(body: { feed_urls: string[] }): CreateManyResponse
async function create(body: CreateParams): CreateResponse {
  const response = await podcastClient<Podcast | Podcast[]>('/podcasts', {
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

async function searchEpisodes(podcastId: string, params: SearchEpisodesParams) {
  const query: QueryType = params ? { ...params } : {}

  const route = `/episodes/podcast/${podcastId}/search`
  const response = await podcastClient<Episodes>(route, {
    method: 'GET',
    query,
  })

  return response
}

async function saveEpisodeProgress(episodeId: string, progress: number) {
  const route = `/episodes/${episodeId}/progress`
  const response = await podcastClient<Playback>(route, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ progress }),
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
  searchEpisodes,
  saveEpisodeProgress,
}
