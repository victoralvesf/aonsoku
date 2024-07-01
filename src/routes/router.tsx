import { createBrowserRouter } from 'react-router-dom'

import BaseLayout from '@/app/layout/base'
import Album from '@/app/pages/albums/album'
import AlbumsList from '@/app/pages/albums/list'
import Artist from '@/app/pages/artists/artist'
import ArtistsList from '@/app/pages/artists/list'
import ErrorPage from '@/app/pages/error-page'
import Home from '@/app/pages/home'
import Login from '@/app/pages/login'
import PlaylistsPage from '@/app/pages/playlists/list'
import Playlist from '@/app/pages/playlists/playlist'
import Radios from '@/app/pages/radios/radios-list'
import SongsList from '@/app/pages/songs/list'

import { albumsListLoader, singleAlbumLoader } from '@/routes/loaders/albums'
import { artistsListLoader, singleArtistLoader } from '@/routes/loaders/artists'
import { homeLoader } from '@/routes/loaders/home'
import { playlistLoader } from '@/routes/loaders/playlists'
import { protectedLoader } from '@/routes/loaders/protected'
import { songsListLoader } from '@/routes/loaders/songs'
import { ROUTES } from '@/routes/routesList'

export const router = createBrowserRouter([
  {
    path: ROUTES.LIBRARY.HOME,
    element: <BaseLayout />,
    loader: protectedLoader,
    children: [
      {
        id: 'home',
        path: ROUTES.LIBRARY.HOME,
        loader: homeLoader,
        element: <Home />,
      },
      {
        id: 'albums',
        path: ROUTES.LIBRARY.ALBUMS,
        loader: albumsListLoader,
        element: <AlbumsList />,
      },
      {
        id: 'artists',
        path: ROUTES.LIBRARY.ARTISTS,
        loader: artistsListLoader,
        element: <ArtistsList />,
      },
      {
        id: 'playlist',
        path: ROUTES.PLAYLIST.PATH,
        loader: playlistLoader,
        errorElement: <ErrorPage />,
        element: <Playlist />,
      },
      {
        id: 'playlists',
        path: ROUTES.LIBRARY.PLAYLISTS,
        errorElement: <ErrorPage />,
        element: <PlaylistsPage />,
      },
      {
        id: 'album',
        path: ROUTES.ALBUM.PATH,
        loader: singleAlbumLoader,
        element: <Album />,
      },
      {
        id: 'artist',
        path: ROUTES.ARTIST.PATH,
        loader: singleArtistLoader,
        element: <Artist />,
      },
      {
        id: 'radios',
        path: ROUTES.LIBRARY.RADIOS,
        element: <Radios />,
      },
      {
        id: 'songs',
        path: ROUTES.LIBRARY.SONGS,
        loader: songsListLoader,
        element: <SongsList />,
      },
      {
        id: 'error',
        path: '*',
        element: <ErrorPage />,
      },
    ],
  },
  {
    id: 'login',
    path: ROUTES.SERVER_CONFIG,
    element: <Login />,
  },
])
