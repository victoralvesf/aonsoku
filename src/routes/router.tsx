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
          const randomSongs = subsonic.songs.getRandomSongs()
          const newestAlbums = subsonic.albums.getAlbumList({ size: 16 })
          const frequentAlbums = subsonic.albums.getAlbumList({ size: 16, type: 'frequent' })
          const recentAlbums = subsonic.albums.getAlbumList({ size: 16, type: 'recent' })
          const randomAlbums = subsonic.albums.getAlbumList({ size: 16, type: 'random' })

          const results = await Promise.all([
            randomSongs,
            newestAlbums,
            frequentAlbums,
            recentAlbums,
            randomAlbums
          ])

          return {
            randomSongs: results[0],
            newestAlbums: results[1],
            frequentAlbums: results[2],
            recentAlbums: results[3],
            randomAlbums: results[4]
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
            const album = await subsonic.albums.getOne(params.albumId)
            const searchAlbumsPromise = subsonic.search.get({
              query: album?.artist!,
              albumCount: 16,
              songCount: 0,
              artistCount: 0
            })


            if (album?.genre) {
              console.log('GENRE:', album.genre)
              const randomGenreAlbumsPromise = subsonic.albums.getAlbumList({
                type: 'byGenre',
                genre: album?.genre,
                size: 16
              })

              return defer({
                album,
                artistAlbums: searchAlbumsPromise,
                randomGenreAlbums: randomGenreAlbumsPromise
              })
            }

            return defer({
              album,
              artistAlbums: searchAlbumsPromise
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
  }
])