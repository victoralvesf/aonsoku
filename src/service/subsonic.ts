import { getAllPlaylists, getOnePlaylist } from "./playlists";

export const subsonic = {
  playlists: {
    getAll: () => getAllPlaylists(),
    getOne: (id: string) => getOnePlaylist(id)
  }
}