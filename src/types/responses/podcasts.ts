interface PaginateResponse<T> {
  current_page: number
  data: T[]
  first_page_url: string
  from: number
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
}

export interface Podcast {
  id: string
  title: string
  description: string
  author: string
  link: string
  image_url: string
  feed_url: string
  is_visible: boolean
  episode_count: number
  created_at: string
  updated_at: string
}

export type Podcasts = PaginateResponse<Podcast>

export interface Playback {
  progress: number
  completed: boolean
}

export interface Episode {
  id: string
  podcast_id: string
  title: string
  description: string
  audio_url: string
  image_url: string
  duration: number
  published_at: string
  created_at: string
  updated_at: string
  playback: Playback[]
}

export type Episodes = PaginateResponse<Episode>

export interface EpisodeWithPodcast extends Episode {
  podcast: Podcast
}

export interface PodcastWithEpisodes {
  podcast: Podcast
  episodes: PaginateResponse<Episode>
}
