import { CreateParams, Playlist, UpdateParams } from './responses/playlist'

export interface PlaylistData {
  id: string
  name: string
  comment: string
  public: boolean
}

export interface IPlaylistsContext {
  playlists: Playlist[]
  fetchPlaylists: () => Promise<void>
  clearPlaylists: () => void
  removePlaylist: (id: string) => Promise<void>
  playlistDialogState: boolean
  setPlaylistDialogState: (state: boolean) => void
  createPlaylist: (data: CreateParams) => Promise<void>
  editPlaylist: (data: UpdateParams) => Promise<void>
  data: PlaylistData
  setData: (data: PlaylistData) => void
}
