import { SubsonicResponse } from "./subsonicResponse"

export interface Playlists {
  playlist: Playlist[]
}

export interface PlaylistsResponse extends SubsonicResponse<{ playlists: Playlists }> {}

export interface Playlist {
  id: string
  name: string
  comment: string
  songCount: number
  duration: number
  public: boolean
  owner: string
  created: string
  changed: string
  coverArt: string
}

export interface PlaylistWithEntries extends Playlist {
  entry: PlaylistSong[]
}

export interface PlaylistWithEntriesResponse extends SubsonicResponse<{ playlist: PlaylistWithEntries }> {}

export interface PlaylistSong {
  id: string
  parent: string
  isDir: boolean
  title: string
  album: string
  artist: string
  track: number
  year: number
  genre?: string
  coverArt: string
  size: number
  contentType: string
  suffix: string
  duration: number
  bitRate: number
  path: string
  playCount: number
  discNumber: number
  created: string
  albumId: string
  artistId?: string
  type: string
  isVideo: boolean
  played: string
  bpm: number
  comment: string
  sortName: string
  mediaType: string
  musicBrainzId: string
  genres: any[]
  replayGain: ReplayGain
}

export interface ReplayGain {
  trackGain: number
  trackPeak: number
  albumPeak: number
}
