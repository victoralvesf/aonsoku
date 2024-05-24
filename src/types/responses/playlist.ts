import { ISong } from "./song"
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
  entry: ISong[]
}

export interface PlaylistWithEntriesResponse extends SubsonicResponse<{ playlist: PlaylistWithEntries }> {}
