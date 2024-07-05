import { Playlist } from './responses/playlist'

export interface PlaylistData {
  id: string
  name: string
  comment: string
  public: boolean
}

interface CreateData {
  name: string
  comment: string
  isPublic: 'true' | 'false'
}

interface UpdateData extends CreateData {
  id: string
}

export interface IPlaylistsContext {
  playlists: Playlist[]
  fetchPlaylists: () => Promise<void>
  clearPlaylists: () => void
  removePlaylist: (id: string) => Promise<void>
  playlistDialogState: boolean
  setPlaylistDialogState: (state: boolean) => void
  createPlaylistWithoutSongs: (data: CreateData) => Promise<void>
  editPlaylist: (data: UpdateData) => Promise<void>
  data: PlaylistData
  setData: (data: PlaylistData) => void
}
