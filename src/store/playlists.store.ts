import { devtools, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { createWithEqualityFn } from 'zustand/traditional'
import { subsonic } from '@/service/subsonic'
import { IPlaylistsContext, PlaylistData } from '@/types/playlistsContext'

export const usePlaylistsStore = createWithEqualityFn<IPlaylistsContext>()(
  subscribeWithSelector(
    devtools(
      immer((set, get) => ({
        playlists: [],
        playlistDialogState: false,
        data: {} as PlaylistData,
        fetchPlaylists: async () => {
          const response = await subsonic.playlists.getAll()

          if (response) {
            set((state) => {
              state.playlists = response
            })
          }
        },
        clearPlaylists: () => {
          set((state) => {
            state.playlists = []
          })
        },
        removePlaylist: async (id) => {
          await subsonic.playlists.remove(id)
          const { playlists } = get()
          const indexToRemove = playlists.findIndex(
            (playlist) => playlist.id === id,
          )

          if (indexToRemove === -1) return

          const updatedPlaylists = [...playlists]
          updatedPlaylists.splice(indexToRemove, 1)

          set((state) => {
            state.playlists = updatedPlaylists
          })
        },
        createPlaylist: async (data) => {
          const playlist = await subsonic.playlists.create(data.name)

          if (playlist) {
            await subsonic.playlists.update({
              playlistId: playlist.id,
              comment: data.comment,
              isPublic: data.isPublic,
              songIdToAdd: data.songIdToAdd,
            })
          }

          await get().fetchPlaylists()
        },
        editPlaylist: async (data) => {
          await subsonic.playlists.update(data)

          await get().fetchPlaylists()
        },
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
