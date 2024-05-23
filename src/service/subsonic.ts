import { getRecentlyAdded } from "./albums";
import { getAllPlaylists, getOnePlaylist } from "./playlists";

export const subsonic = {
  albums: {
    getRecentlyAdded: () => getRecentlyAdded()
  },
  playlists: {
    getAll: () => getAllPlaylists(),
    getOne: (id: string) => getOnePlaylist(id)
  }
}