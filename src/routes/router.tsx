import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { HomeFallback } from '@/app/components/home/fallbacks'
import { PlaylistFallback } from '@/app/components/playlist/fallbacks'
import { SongsListFallback } from '@/app/components/songs/fallbacks'
import { albumsListLoader, singleAlbumLoader } from '@/routes/loaders/albums'
import { artistsListLoader, singleArtistLoader } from '@/routes/loaders/artists'
import { homeLoader } from '@/routes/loaders/home'
import { playlistLoader } from '@/routes/loaders/playlists'
import { protectedLoader } from '@/routes/loaders/protected'
import { songsListLoader } from '@/routes/loaders/songs'
import { ROUTES } from '@/routes/routesList'

const BaseLayout = lazy(() => import('@/app/layout/base'))
const Album = lazy(() => import('@/app/pages/albums/album'))
const AlbumsList = lazy(() => import('@/app/pages/albums/list'))
const Artist = lazy(() => import('@/app/pages/artists/artist'))
const ArtistsList = lazy(() => import('@/app/pages/artists/list'))
const ErrorPage = lazy(() => import('@/app/pages/error-page'))
const Login = lazy(() => import('@/app/pages/login'))
const PlaylistsPage = lazy(() => import('@/app/pages/playlists/list'))
const Playlist = lazy(() => import('@/app/pages/playlists/playlist'))
const Radios = lazy(() => import('@/app/pages/radios/radios-list'))
const SongsList = lazy(() => import('@/app/pages/songs/list'))
const Home = lazy(() => import('@/app/pages/home'))

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
        element: (
          <Suspense fallback={<HomeFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        id: 'albums',
        path: ROUTES.LIBRARY.ALBUMS,
        loader: albumsListLoader,
        element: (
          <Suspense>
            <AlbumsList />
          </Suspense>
        ),
      },
      {
        id: 'artists',
        path: ROUTES.LIBRARY.ARTISTS,
        loader: artistsListLoader,
        element: (
          <Suspense>
            <ArtistsList />
          </Suspense>
        ),
      },
      {
        id: 'playlist',
        path: ROUTES.PLAYLIST.PATH,
        loader: playlistLoader,
        errorElement: (
          <Suspense>
            <ErrorPage />
          </Suspense>
        ),
        element: (
          <Suspense fallback={<PlaylistFallback />}>
            <Playlist />
          </Suspense>
        ),
      },
      {
        id: 'playlists',
        path: ROUTES.LIBRARY.PLAYLISTS,
        errorElement: (
          <Suspense>
            <ErrorPage />
          </Suspense>
        ),
        element: (
          <Suspense>
            <PlaylistsPage />
          </Suspense>
        ),
      },
      {
        id: 'album',
        path: ROUTES.ALBUM.PATH,
        loader: singleAlbumLoader,
        element: (
          <Suspense>
            <Album />
          </Suspense>
        ),
      },
      {
        id: 'artist',
        path: ROUTES.ARTIST.PATH,
        loader: singleArtistLoader,
        element: (
          <Suspense fallback={<SongsListFallback />}>
            <Artist />
          </Suspense>
        ),
      },
      {
        id: 'radios',
        path: ROUTES.LIBRARY.RADIOS,
        element: (
          <Suspense>
            <Radios />
          </Suspense>
        ),
      },
      {
        id: 'songs',
        path: ROUTES.LIBRARY.SONGS,
        loader: songsListLoader,
        element: (
          <Suspense fallback={<SongsListFallback />}>
            <SongsList />
          </Suspense>
        ),
      },
      {
        id: 'error',
        path: '*',
        element: (
          <Suspense>
            <ErrorPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    id: 'login',
    path: ROUTES.SERVER_CONFIG,
    element: (
      <Suspense>
        <Login />
      </Suspense>
    ),
  },
])
