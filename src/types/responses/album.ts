import { SubsonicResponse } from "./subsonicResponse"

export interface AlbumList {
  album: Album[]
}

export interface AlbumListResponse extends SubsonicResponse<{ albumList: AlbumList }> {}

export interface Album {
  id: string
  parent: string
  isDir: boolean
  title: string
  name: string
  album: string
  artist: string
  year: number
  genre?: string
  coverArt: string
  duration: number
  playCount?: number
  created: string
  artistId: string
  songCount: number
  isVideo: boolean
  played?: string
  bpm: number
  comment: string
  sortName: string
  mediaType: string
  musicBrainzId: string
  genres: any[]
  replayGain: ReplayGain
}

export interface ReplayGain {}