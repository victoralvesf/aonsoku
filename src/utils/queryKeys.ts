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
  info: 'get-song-info',
  count: 'get-song-count',
}

const radio = {
  all: 'get-all-radios',
}

const search = 'search-key'

const genre = 'get-all-genres'

const update = {
  serverInfo: 'get-server-info',
  check: 'check-for-updates',
}

const podcast = {
  all: 'get-all-podcasts',
  one: 'get-podcast',
}

const episode = {
  all: 'get-podcast-episodes',
  one: 'get-episode',
  latest: 'get-latest-episodes',
}

export const queryKeys = {
  album,
  artist,
  playlist,
  song,
  radio,
  search,
  genre,
  update,
  podcast,
  episode,
}
