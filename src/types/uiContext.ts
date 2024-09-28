interface ISongInfo {
  songId: string
  setSongId: (id: string) => void
  modalOpen: boolean
  setModalOpen: (open: boolean) => void
  reset: () => void
}

export interface IUiContext {
  songInfo: ISongInfo
}
