import { createBrowserRouter } from 'react-router-dom'

import BaseLayout from '@/app/layout/base'
import ErrorPage from '@/app/pages/error-page'
import AlbumList from '@/app/pages/albums/album-list'
import Playlist from '@/app/pages/playlists/playlist'
import Home from '@/app/pages/home'
import Album from '@/app/pages/albums/album'
import Artist from '@/app/pages/artists/artist'
import Login from '@/app/pages/login'

import { homeLoader } from '@/routes/loaders/home'
import { albumsListLoader, singleAlbumLoader } from '@/routes/loaders/albums'
import { playlistLoader } from '@/routes/loaders/playlists'
import { singleArtistLoader } from '@/routes/loaders/artists'
import { ROUTES } from '@/routes/routesList'

export const router = createBrowserRouter([
  {
    path: ROUTES.LIBRARY.HOME,
    element: <BaseLayout />,
    children: [
      {
        id: 'home',
        path: ROUTES.LIBRARY.HOME,
        loader: homeLoader,
        element: <Home />
      },
      {
        id: 'albums',
        path: ROUTES.LIBRARY.ALBUMS,
        loader: albumsListLoader,
        element: <AlbumList />
      },
      {
        id: 'playlist',
        path: ROUTES.PLAYLIST.PATH,
        loader: playlistLoader,
        element: <Playlist />
      },
      {
        id: 'album',
        path: ROUTES.ALBUM.PATH,
        loader: singleAlbumLoader,
        element: <Album />
      },
      {
        id: 'artist',
        path: ROUTES.ARTIST.PATH,
        loader: singleArtistLoader,
        element: <Artist />
      },
      {
        id: 'error',
        path: '*',
        element: <ErrorPage />
      }
    ]
  },
  {
    id: 'login',
    path: ROUTES.SERVER_CONFIG,
    element: <Login />
  }
])