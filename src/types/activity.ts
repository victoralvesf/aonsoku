export interface PlayEvent {
  songId: string
  title: string
  artist: string
  artistId?: string
  album: string
  albumId?: string
  genre?: string
  duration: number
  playedAt: number
}

export type ActivityRange = '7d' | '30d' | '90d' | 'all'
