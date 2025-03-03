import {
  GetAllParams,
  podcasts,
  SearchEpisodesParams,
  SearchParams,
  ShowParams,
} from '@/service/podcasts'

const emptyPodcastResponse = { podcasts: [], nextOffset: null }

export async function getPodcastList(params: Required<GetAllParams>) {
  const response = await podcasts.getAll(params)

  if (!response) return emptyPodcastResponse
  if (!response.data) return emptyPodcastResponse

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

const emptyEpisodeResponse = { episodes: [], count: null, nextOffset: null }

export async function getPodcastEpisodes(
  id: string,
  params: Required<ShowParams>,
) {
  const response = await podcasts.getOne(id, params)

  if (!response) return emptyEpisodeResponse
  if (!response.episodes.data) return emptyEpisodeResponse

  let nextOffset = null
  if (response.episodes.next_page_url !== null) {
    nextOffset = params.page + 1
  }

  return {
    episodes: response.episodes.data,
    count: response.podcast.episode_count,
    nextOffset,
  }
}

export async function searchEpisodes(
  podcastId: string,
  params: Required<SearchEpisodesParams>,
) {
  const response = await podcasts.searchEpisodes(podcastId, params)

  if (!response) return emptyEpisodeResponse
  if (!response.data) return emptyEpisodeResponse

  let nextOffset = null
  if (response.next_page_url !== null) {
    nextOffset = params.page + 1
  }

  return {
    episodes: response.data,
    count: null,
    nextOffset,
  }
}

export async function searchPodcasts(params: Required<SearchParams>) {
  const response = await podcasts.search(params)

  if (!response) return emptyPodcastResponse
  if (!response.data) return emptyPodcastResponse

  let nextOffset = null
  if (response.next_page_url !== null) {
    nextOffset = params.page + 1
  }

  return {
    podcasts: response.data,
    nextOffset,
  }
}
