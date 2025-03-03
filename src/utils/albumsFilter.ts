export enum AlbumsSearchParams {
  MainFilter = 'filter',
  YearFilter = 'yearFilter',
  Genre = 'genre',
  ArtistId = 'artistId',
  ArtistName = 'artistName',
  Query = 'query',
}

export enum YearSortOptions {
  Oldest = 'oldest',
  Newest = 'newest',
}

export type YearFilter = `${YearSortOptions}`

export enum AlbumsFilters {
  ByArtist = 'alphabeticalByArtist',
  ByGenre = 'byGenre',
  Starred = 'starred',
  MostPlayed = 'frequent',
  ByName = 'alphabeticalByName',
  Random = 'random',
  RecentlyAdded = 'newest',
  RecentlyPlayed = 'recent',
  ByYear = 'byYear',
  ByDiscography = 'artistDiscography',
  Search = 'search',
}

export const albumsFilterValues = [
  {
    key: AlbumsFilters.ByArtist,
    label: 'album.list.filter.artist',
  },
  {
    key: AlbumsFilters.ByGenre,
    label: 'album.list.filter.genre',
  },
  {
    key: AlbumsFilters.Starred,
    label: 'album.list.filter.favorites',
  },
  {
    key: AlbumsFilters.MostPlayed,
    label: 'album.list.filter.mostPlayed',
  },
  {
    key: AlbumsFilters.ByName,
    label: 'album.list.filter.name',
  },
  {
    key: AlbumsFilters.Random,
    label: 'album.list.filter.random',
  },
  {
    key: AlbumsFilters.RecentlyAdded,
    label: 'album.list.filter.recentlyAdded',
  },
  {
    key: AlbumsFilters.RecentlyPlayed,
    label: 'album.list.filter.recentlyPlayed',
  },
  {
    key: AlbumsFilters.ByYear,
    label: 'album.list.filter.releaseYear',
  },
  {
    key: AlbumsFilters.ByDiscography,
    label: 'album.list.filter.discography',
  },
  {
    key: AlbumsFilters.Search,
    label: 'album.list.filter.search',
  },
]

export enum SortOptions {
  Asc = 'asc',
  Desc = 'desc',
}

export enum EpisodesOrderByOptions {
  PublishedAt = 'published_at',
  Title = 'title',
  Duration = 'duration',
}

export enum PodcastsOrderByOptions {
  Title = 'title',
  EpisodeCount = 'episode_count',
}
