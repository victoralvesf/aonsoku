import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

import { subsonic } from '@/service/subsonic'
import { Playlist } from '@/types/responses/playlist'

interface PlaylistData {
  id: string
  name: string
  comment: string
  public: boolean
}

interface PlaylistContextState {
  playlists: Playlist[]
  fetchPlaylists: () => Promise<void>
  removePlaylist: (id: string) => Promise<void>
  playlistDialogState: boolean
  setPlaylistDialogState: (state: boolean) => void
  createPlaylistWithoutSongs: (
    name: string,
    comment: string,
    isPublic: 'true' | 'false',
  ) => Promise<void>
  editPlaylist: (
    id: string,
    name: string,
    comment: string,
    isPublic: 'true' | 'false',
  ) => Promise<void>
  data: PlaylistData
  setData: (data: PlaylistData) => void
}

const PlaylistContext = createContext<PlaylistContextState>(
  {} as PlaylistContextState,
)

interface PlaylistProviderProps {
  children: ReactNode
}

export function PlaylistProvider({ children }: PlaylistProviderProps) {
  const { t } = useTranslation()
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistDialogState, setPlaylistDialogState] = useState(false)
  const [data, setData] = useState<PlaylistData>({} as PlaylistData)

  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await subsonic.playlists.getAll()
      response ? setPlaylists(response) : setPlaylists([])
    } catch (_) {}
  }, [])

  const removePlaylist = useCallback(
    async (id: string) => {
      try {
        await subsonic.playlists.remove(id)

        setPlaylists((list) => {
          const indexToRemove = list.findIndex((playlist) => playlist.id === id)

          const newList = [...list]
          newList.splice(indexToRemove, 1)

          return newList
        })

        toast.success(t('playlist.form.delete.toast.success'))
      } catch (_) {
        toast.error(t('playlist.form.delete.toast.error'))
      }
    },
    [t],
  )

  const createPlaylistWithoutSongs = useCallback(
    async (name: string, comment: string, isPublic: 'true' | 'false') => {
      try {
        const playlist = await subsonic.playlists.create(name)
        if (playlist) {
          await subsonic.playlists.update({
            playlistId: playlist.id,
            comment,
            isPublic,
          })
        }

        await fetchPlaylists()
        toast.success(t('playlist.form.create.toast.success'))
      } catch (_) {
        toast.error(t('playlist.form.create.toast.success'))
      }
    },
    [fetchPlaylists, t],
  )

  const editPlaylist = useCallback(
    async (
      id: string,
      name: string,
      comment: string,
      isPublic: 'true' | 'false',
    ) => {
      try {
        await subsonic.playlists.update({
          playlistId: id,
          name,
          comment,
          isPublic,
        })

        await fetchPlaylists()
        toast.success(t('playlist.form.edit.toast.success'))
      } catch (_) {
        toast.error(t('playlist.form.edit.toast.error'))
      }
    },
    [fetchPlaylists, t],
  )

  const value: PlaylistContextState = {
    playlists,
    fetchPlaylists,
    removePlaylist,
    playlistDialogState,
    setPlaylistDialogState,
    createPlaylistWithoutSongs,
    editPlaylist,
    data,
    setData,
  }

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  )
}

export const usePlaylists = () => {
  const context = useContext(PlaylistContext)

  if (context === undefined)
    throw new Error('usePlaylists must be used within a PlaylistProvider')

  return context
}
