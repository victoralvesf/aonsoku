import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { IPlaylistsContext, PlaylistData } from '@/types/playlistsContext'

export const usePlaylistsStore = createWithEqualityFn<IPlaylistsContext>()(
  subscribeWithSelector(
    devtools(
      immer((set) => ({
        playlistDialogState: false,
        data: {} as PlaylistData,
        setPlaylistDialogState: (dialogState) => {
          set((state) => {
            state.playlistDialogState = dialogState
          })
        },
        setData: (data) => {
          set((state) => {
            state.data = data
          })
        },
      })),
      {
        name: 'playlists_store',
      },
    ),
  ),
)

export const usePlaylists = () => usePlaylistsStore((state) => state)
