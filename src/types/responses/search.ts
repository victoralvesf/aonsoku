import { Albums } from './album'
import { ISimilarArtist } from './artist'
import { ISong } from './song'
import { SubsonicResponse } from './subsonicResponse'

export interface Search {
  artist?: ISimilarArtist[]
  album?: Albums[]
  song?: ISong[]
}

export interface ISearchResponse
  extends SubsonicResponse<{ searchResult3: Search }> {}
