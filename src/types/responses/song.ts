import { IFeaturedArtist } from './artist'
import { SubsonicResponse } from './subsonicResponse'

export interface IReplayGain {
  trackGain: number
  trackPeak: number
  albumGain: number
  albumPeak: number
}

export interface IGenre {
  name: string
}

export interface ILyric {
  artist?: string
  title?: string
  value?: string
}

export interface IContributor {
  role: string
  artist: IFeaturedArtist
}

export interface ISong {
  id: string
  parent: string
  isDir: boolean
  title: string
  album: string
  artist: string
  track: number
  year: number
  genre?: string
  coverArt: string
  size: number
  contentType: string
  suffix: string
  duration: number
  bitRate: number
  path: string
  playCount?: number
  discNumber: number
  created: string
  albumId: string
  artistId?: string
  type: string
  isVideo: boolean
  played?: string
  bpm: number
  starred?: string
  comment: string
  sortName: string
  mediaType: string
  musicBrainzId: string
  genres: IGenre[]
  replayGain: IReplayGain
  channelCount?: number
  samplingRate?: number
  bitDepth?: number
  moods?: string[]
  artists?: IFeaturedArtist[]
  displayArtist?: string
  albumArtists?: IFeaturedArtist[]
  displayAlbumArtist?: string
  contributors?: IContributor[]
  displayComposer?: string
  explicitStatus?: string
}

export interface SongList {
  song: ISong[]
}

export interface RandomSongsResponse
  extends SubsonicResponse<{ randomSongs: SongList }> {}

export interface TopSongsResponse
  extends SubsonicResponse<{ topSongs: SongList }> {}

export interface LyricsResponse extends SubsonicResponse<{ lyrics: ILyric }> {}

export interface GetSongResponse extends SubsonicResponse<{ song: ISong }> {}
