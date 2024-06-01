import { subsonic } from "@/service/subsonic"
import { redirect } from "react-router-dom"

export async function homeLoader() {
  const serverUrl = localStorage.getItem("server-url")
  if (!serverUrl) return redirect('/server-config')

  const randomSongsPromise = subsonic.songs.getRandomSongs()
  const newestAlbumsPromise = subsonic.albums.getAlbumList({ size: 16 })
  const frequentAlbumsPromise = subsonic.albums.getAlbumList({ size: 16, type: 'frequent' })
  const recentAlbumsPromise = subsonic.albums.getAlbumList({ size: 16, type: 'recent' })
  const randomAlbumsPromise = subsonic.albums.getAlbumList({ size: 16, type: 'random' })

  const [
    randomSongs,
    newestAlbums,
    frequentAlbums,
    recentAlbums,
    randomAlbums,
  ] = await Promise.all([
    randomSongsPromise,
    newestAlbumsPromise,
    frequentAlbumsPromise,
    recentAlbumsPromise,
    randomAlbumsPromise
  ])

  return {
    randomSongs,
    newestAlbums,
    frequentAlbums,
    recentAlbums,
    randomAlbums,
  }
}