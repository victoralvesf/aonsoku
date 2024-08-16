export interface PlaylistData {
  id: string
  name: string
  comment: string
  public: boolean
}

export interface IPlaylistsContext {
  playlistDialogState: boolean
  setPlaylistDialogState: (state: boolean) => void
  data: PlaylistData
  setData: (data: PlaylistData) => void
}
