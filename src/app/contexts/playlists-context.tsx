import { subsonic } from "@/service/subsonic";
import { Playlist } from "@/types/responses/playlist";
import { ReactNode, createContext, useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

interface PlaylistContextState {
  playlists: Playlist[]
  removePlaylist: (id: string) => Promise<void>
}

const initialState = {
  playlists: [],
  removePlaylist: async () => { }
}

const PlaylistContext = createContext<PlaylistContextState>(initialState)

interface PlaylistProviderProps {
  children: ReactNode
}

export function PlaylistProvider({ children }: PlaylistProviderProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
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

  const value: PlaylistContextState = {
    playlists,
    removePlaylist
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