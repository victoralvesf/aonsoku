import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import {
  AlbumFallback,
  AlbumsFallback,
} from '@/app/components/fallbacks/album-fallbacks'
import { HomeFallback } from '@/app/components/fallbacks/home-fallbacks'
import { PlaylistFallback } from '@/app/components/fallbacks/playlist-fallbacks'
import {
  InfinitySongListFallback,
  SongListFallback,
} from '@/app/components/fallbacks/song-fallbacks'
import { protectedLoader } from '@/routes/protectedLoader'
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
const SongList = lazy(() => import('@/app/pages/songs/songlist'))
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
        element: (
          <Suspense fallback={<HomeFallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        id: 'artists',
        path: ROUTES.LIBRARY.ARTISTS,
        element: (
          <Suspense fallback={<SongListFallback />}>
            <ArtistsList />
          </Suspense>
        ),
      },
      {
        id: 'songs',
        path: ROUTES.LIBRARY.SONGS,
        element: (
          <Suspense fallback={<InfinitySongListFallback />}>
            <SongList />
          </Suspense>
        ),
      },
      {
        id: 'albums',
        path: ROUTES.LIBRARY.ALBUMS,
        element: (
          <Suspense fallback={<AlbumsFallback />}>
            <AlbumsList />
          </Suspense>
        ),
      },
      {
        id: 'playlists',
        path: ROUTES.LIBRARY.PLAYLISTS,
        element: (
          <Suspense fallback={<SongListFallback />}>
            <PlaylistsPage />
          </Suspense>
        ),
      },
      {
        id: 'radios',
        path: ROUTES.LIBRARY.RADIOS,
        element: (
          <Suspense fallback={<SongListFallback />}>
            <Radios />
          </Suspense>
        ),
      },
      {
        id: 'artist',
        path: ROUTES.ARTIST.PATH,
        element: (
          <Suspense fallback={<AlbumFallback />}>
            <Artist />
          </Suspense>
        ),
      },
      {
        id: 'album',
        path: ROUTES.ALBUM.PATH,
        element: (
          <Suspense fallback={<AlbumFallback />}>
            <Album />
          </Suspense>
        ),
      },
      {
        id: 'playlist',
        path: ROUTES.PLAYLIST.PATH,
        element: (
          <Suspense fallback={<PlaylistFallback />}>
            <Playlist />
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
