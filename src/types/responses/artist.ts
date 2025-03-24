import { Albums } from './album'
import { SubsonicResponse } from './subsonicResponse'

export interface IFeaturedArtist {
  id: string
  name: string
}

export interface IArtist {
  id: string
  name: string
  coverArt: string
  albumCount: number
  starred?: string
  artistImageUrl: string
  musicBrainzId?: string
  sortName?: string
  roles?: string[]
  album?: Albums[]
}

export interface ISimilarArtist {
  id: string
  name: string
  albumCount: number
  coverArt: string
  artistImageUrl: string
  starred?: string
}

export interface ArtistResponse extends SubsonicResponse<{ artist: IArtist }> {}

export interface IArtistInfo {
  biography?: string
  musicBrainzId?: string
  lastFmUrl?: string
  smallImageUrl?: string
  mediumImageUrl?: string
  largeImageUrl?: string
  similarArtist?: ISimilarArtist[]
}

export interface ArtistInfoResponse
  extends SubsonicResponse<{ artistInfo: IArtistInfo }> {}

export interface ArtistSeparator {
  name: string
  artist: ISimilarArtist[]
}

export interface Artists {
  index: ArtistSeparator[]
  lastModified: number
  ignoredArticles: string
}

export interface ArtistsResponse
  extends SubsonicResponse<{ artists: Artists }> {}
