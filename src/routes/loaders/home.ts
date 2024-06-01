import { subsonic } from "@/service/subsonic"
import { redirect } from "react-router-dom"
import { ROUTES } from "@/routes/routesList"

export async function homeLoader() {
  const serverUrl = localStorage.getItem("server-url")
  if (!serverUrl) return redirect(ROUTES.SERVER_CONFIG)

  const isBackendUp = await subsonic.ping.pingView()
  if (!isBackendUp) return redirect(ROUTES.SERVER_CONFIG)

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