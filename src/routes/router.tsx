import { createBrowserRouter, defer } from 'react-router-dom'

import { subsonic } from '@/service/subsonic'

import BaseLayout from '@/app/layout/base'
import ErrorPage from '@/app/pages/error-page'
import RecentlyAddedAlbums from '@/app/pages/albums/recently-added'
import Playlist from '@/app/pages/playlists/playlist'
import Home from '@/app/pages/home'
import Album from '@/app/pages/albums/album'
import Artist from '@/app/pages/artists/artist'

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
        id: 'album',
        path: 'library/albums/:albumId',
        loader: async ({ params }) => {
          if (params.albumId) {
            return await subsonic.albums.getOne(params.albumId)
          }
        },
        element: <Album />
      },
      {
        id: 'artist',
        path: 'library/artists/:artistId',
        loader: async ({ params }) => {
          if (params.artistId) {
            const artist = await subsonic.artists.getOne(params.artistId)
            const artistInfoPromise = subsonic.artists.getInfo(params.artistId)
            const topSongsPromise = subsonic.songs.getTopSongs(artist?.name || '')

            return defer({
              artist,
              artistInfo: artistInfoPromise,
              topSongs: topSongsPromise
            })
          }
        },
        element: <Artist />
      },
      {
        id: 'error',
        path: '*',
        element: <ErrorPage />
      }
    ]
  }
])