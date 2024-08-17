const playlist = {
  all: 'get-all-playlists',
  single: 'get-playlist',
}

const album = {
  all: 'get-all-albums',
  single: 'get-album',
  info: 'get-album-info',
  moreAlbums: 'get-artist-albums',
  genreAlbums: 'get-genre-random-albums',
}

const artist = {
  all: 'get-all-artists',
}

const song = {
  all: 'get-all-songs',
}

const radio = {
  all: 'get-all-radios',
}

export const queryKeys = {
  album,
  artist,
  playlist,
  song,
  radio,
}

export const allQueryKeys: string[] = Object.values(queryKeys).flatMap(
  Object.values,
)
