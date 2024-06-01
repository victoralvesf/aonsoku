import { createBrowserRouter, defer, redirect } from 'react-router-dom'

import { subsonic } from '@/service/subsonic'

import BaseLayout from '@/app/layout/base'
import ErrorPage from '@/app/pages/error-page'
import AlbumList from '@/app/pages/albums/album-list'
import Playlist from '@/app/pages/playlists/playlist'
import Home from '@/app/pages/home'
import Album from '@/app/pages/albums/album'
import Artist from '@/app/pages/artists/artist'
import Login from '@/app/pages/login'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        id: 'home',
        path: '/',
        loader: async () => {
          const serverUrl = localStorage.getItem("server-url")
          if (!serverUrl) return redirect('/server-config')

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
        },
        element: <Home />
      },
      {
        id: 'albums',
        path: 'library/albums',
        loader: async () => await subsonic.albums.getAlbumList({ type: 'newest', size: 32 }),
        element: <AlbumList />
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
            const album = await subsonic.albums.getOne(params.albumId)
            const albumInfoPromise = subsonic.albums.getInfo(album?.id!)
            const searchAlbumsPromise = subsonic.search.get({
              query: album?.artist!,
              albumCount: 16,
              songCount: 0,
              artistCount: 0
            })

            if (album?.genre) {
              const randomGenreAlbumsPromise = subsonic.albums.getAlbumList({
                type: 'byGenre',
                genre: album?.genre,
                size: 16
              })

              return defer({
                album,
                artistAlbums: searchAlbumsPromise,
                albumInfo: albumInfoPromise,
                randomGenreAlbums: randomGenreAlbumsPromise
              })
            }

            return defer({
              album,
              artistAlbums: searchAlbumsPromise,
              albumInfo: albumInfoPromise,
            })
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
  },
  {
    id: 'login',
    path: '/server-config',
    element: <Login />
  }
])