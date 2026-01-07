import { Albums } from './album'
import { ISimilarArtist } from './artist'
import { ISong } from './song'
import { SubsonicResponse } from './subsonicResponse'

export interface LovedSongs {
  artist?: ISimilarArtist[]
  album?: Albums[]
  song?: ISong[]
}

export interface ILovedSongsResponse
  extends SubsonicResponse<{ starred2: LovedSongs }> {}
