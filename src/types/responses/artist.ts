import { IArtistAlbum } from "./album"
import { SubsonicResponse } from "./subsonicResponse"

export interface IArtist {
  id: string
  name: string
  coverArt: string
  albumCount: number
  starred?: string
  artistImageUrl: string
  album: IArtistAlbum[]
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

export interface ArtistInfoResponse extends SubsonicResponse<{ artistInfo: IArtistInfo }> {}

export interface ISimilarArtist {
  id: string
  name: string
  albumCount: number
  coverArt: string
  artistImageUrl: string
}
