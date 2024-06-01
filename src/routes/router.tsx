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

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        id: 'home',
        path: '/',
        loader: homeLoader,
        element: <Home />
      },
      {
        id: 'albums',
        path: 'library/albums',
        loader: albumsListLoader,
        element: <AlbumList />
      },
      {
        id: 'playlist',
        path: 'playlist/:playlistId',
        loader: playlistLoader,
        element: <Playlist />
      },
      {
        id: 'album',
        path: 'library/albums/:albumId',
        loader: singleAlbumLoader,
        element: <Album />
      },
      {
        id: 'artist',
        path: 'library/artists/:artistId',
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
    path: '/server-config',
    element: <Login />
  }
])