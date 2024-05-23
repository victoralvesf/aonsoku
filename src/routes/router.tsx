import BaseLayout from '@/app/layout/base'
import ErrorPage from '@/app/pages/error-page'
import RecentlyAddedAlbums from '@/app/pages/albums/recently-added'
import { createBrowserRouter } from 'react-router-dom'
import Playlist from '@/app/pages/playlists/playlist'
import { subsonic } from '@/service/subsonic'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        id: 'home',
        path: '/',
        element: <h1>Teste</h1>
      },
      {
        id: 'recently-added',
        path: 'albums/recently-added',
        loader: subsonic.albums.getRecentlyAdded,
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
      }
    ]
  }
])