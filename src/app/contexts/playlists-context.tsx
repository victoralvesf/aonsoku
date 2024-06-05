import { subsonic } from "@/service/subsonic";
import { Playlist } from "@/types/responses/playlist";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface PlaylistContextState {
  playlists: Playlist[]
  fetchPlaylists: () => Promise<void>
  removePlaylist: (id: string) => Promise<void>
  playlistDialogState: boolean
  setPlaylistDialogState: (state: boolean) => void
  createPlaylistWithoutSongs: (name: string, comment: string, isPublic: 'true' | 'false') => Promise<void>
}

const initialState: PlaylistContextState = {
  playlists: [],
  fetchPlaylists: async () => { },
  removePlaylist: async () => { },
  playlistDialogState: false,
  setPlaylistDialogState: () => { },
  createPlaylistWithoutSongs: async () => { }
}

const PlaylistContext = createContext<PlaylistContextState>(initialState)

interface PlaylistProviderProps {
  children: ReactNode
}

export function PlaylistProvider({ children }: PlaylistProviderProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [playlistDialogState, setPlaylistDialogState] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = useCallback(async () => {
    try {
      const response = await subsonic.playlists.getAll()
      response ? setPlaylists(response) : setPlaylists([])
    } catch (_) { }
  }, [])

  const removePlaylist = useCallback(async (id: string) => {
    try {
      await subsonic.playlists.remove(id)

      setPlaylists((list) => {
        const indexToRemove = list.findIndex((playlist) => playlist.id === id)

        const newList = [...list]
        newList.splice(indexToRemove, 1)

        return newList
      })

      toast.success(t('playlist.removeDialog.toast.success'))
    } catch (_) {
      toast.error(t('playlist.removeDialog.toast.error'))
    }
  }, [])

  const createPlaylistWithoutSongs = useCallback(async (name: string, comment: string, isPublic: 'true' | 'false') => {
    try {
      const playlist = await subsonic.playlists.create(name)
      if (playlist) {
        await subsonic.playlists.update({
          playlistId: playlist.id,
          comment,
          isPublic
        })
      }

      await fetchPlaylists()
      toast.success(t('playlist.createDialog.toast.success'))
    } catch (_) {
      toast.error(t('playlist.createDialog.toast.error'))
    }
  }, [])

  const value: PlaylistContextState = {
    playlists,
    fetchPlaylists,
    removePlaylist,
    playlistDialogState,
    setPlaylistDialogState,
    createPlaylistWithoutSongs
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
    throw new Error("usePlaylists must be used within a PlaylistProvider")

  return context
}