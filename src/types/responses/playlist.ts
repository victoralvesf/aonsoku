import { ISong } from './song'
import { SubsonicResponse } from './subsonicResponse'

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

export interface Playlists {
  playlist: Playlist[]
}

export interface PlaylistsResponse
  extends SubsonicResponse<{ playlists: Playlists }> {}

export interface SinglePlaylistResponse
  extends SubsonicResponse<{ playlist: Playlist }> {}

export interface PlaylistWithEntries extends Playlist {
  entry: ISong[]
}

export interface PlaylistWithEntriesResponse
  extends SubsonicResponse<{ playlist: PlaylistWithEntries }> {}

export interface UpdateParams {
  playlistId: string
  name?: string
  comment?: string
  isPublic?: 'true' | 'false'
  songIdToAdd?: string | string[]
  songIndexToRemove?: string | string[]
}

export interface CreateParams {
  name: string
  comment: string
  isPublic: 'true' | 'false'
  songIdToAdd?: string | string[]
}
