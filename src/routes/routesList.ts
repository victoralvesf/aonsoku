const LIBRARY = {
  HOME: '/',
  ARTISTS: '/library/artists',
  SONGS: '/library/songs',
  ALBUMS: '/library/albums',
  PLAYLISTS: '/library/playlists',
  RADIOS: '/library/radios',
}

const ARTIST = {
  PAGE: (artistId: string) => `${LIBRARY.ARTISTS}/${artistId}`,
  PATH: `${LIBRARY.ARTISTS}/:artistId`,
  ALBUMS: (artistId: string) => `${LIBRARY.ALBUMS}/artist/${artistId}`,
}

const ALBUM = {
  PAGE: (albumId: string) => `${LIBRARY.ALBUMS}/${albumId}`,
  PATH: `${LIBRARY.ALBUMS}/:albumId`,
}

const ALBUMS = {
  GENRE: (genre: string) =>
    `${LIBRARY.ALBUMS}?filter=byGenre&genre=${encodeURIComponent(genre)}`,
}

const PLAYLIST = {
  PAGE: (playlistId: string) => `${LIBRARY.PLAYLISTS}/${playlistId}`,
  PATH: `${LIBRARY.PLAYLISTS}/:playlistId`,
}

const SERVER_CONFIG = '/server-config'

export const ROUTES = {
  LIBRARY,
  ARTIST,
  ALBUM,
  ALBUMS,
  PLAYLIST,
  SERVER_CONFIG,
}
