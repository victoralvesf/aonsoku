import { SubsonicResponse } from './subsonicResponse'

export interface Genre {
  value: string
  songCount: number
  albumCount: number
}

export interface Genres {
  genre: Genre[]
}

export interface GenresResponse extends SubsonicResponse<{ genres: Genres }> {}
