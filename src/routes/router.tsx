import BaseLayout from '@/app/layout/base'
import ErrorPage from '@/app/pages/error-page'
import RecentlyAddedAlbums from '@/app/pages/albums/recently-added'
import { createBrowserRouter } from 'react-router-dom'
import Playlist from '@/app/pages/playlists/playlist'
import { subsonic } from '@/service/subsonic'
import Home from '@/app/pages/home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        id: 'home',
        path: '/',
        loader: async () => {
          const randomSongs = await subsonic.songs.getRandomSongs()
          const newestAlbums = await subsonic.albums.getAlbumList({ size: '16' })
          const frequentAlbums = await subsonic.albums.getAlbumList({ size: '16', type: 'frequent' })
          const recentAlbums = await subsonic.albums.getAlbumList({ size: '16', type: 'recent' })
          const randomAlbums = await subsonic.albums.getAlbumList({ size: '16', type: 'random' })

          return {
            randomSongs,
            newestAlbums,
            frequentAlbums,
            recentAlbums,
            randomAlbums
          }
        },
        element: <Home />
      },
      {
        id: 'albums',
        path: 'library/albums',
        loader: async () => await subsonic.albums.getAlbumList(),
        element: <RecentlyAddedAlbums />
      },
      {
        id: 'playlist',
        path: 'playlist/:playlistId',
        loader: async ({ params }) => {
          if (params.playlistId) {
            return await subsonic.playlists.getOne(params.playlistId)
          }
        },
        element: <Playlist />
      },
      {
        id: 'error',
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
])