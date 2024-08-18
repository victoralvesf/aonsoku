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
  recentlyAdded: 'get-recently-added-albums',
  mostPlayed: 'get-most-played-albums',
  recentlyPlayed: 'get-recently-played-albums',
  random: 'get-random-albums',
}

const artist = {
  all: 'get-all-artists',
  single: 'get-artist',
  info: 'get-artist-info',
  topSongs: 'get-artist-top-songs',
}

const song = {
  all: 'get-all-songs',
  random: 'get-random-songs',
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
