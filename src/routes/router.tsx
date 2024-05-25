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
          const recentlyAdded = await subsonic.albums.getRecentlyAdded('16')

          return {
            randomSongs,
            recentlyAdded
          }
        },
        element: <Home />
      },
      {
        id: 'albums',
        path: 'library/albums',
        loader: async () => await subsonic.albums.getRecentlyAdded(),
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