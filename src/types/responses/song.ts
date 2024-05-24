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
  playCount: number
  discNumber: number
  created: string
  albumId: string
  artistId?: string
  type: string
  isVideo: boolean
  played: string
  bpm: number
  comment: string
  sortName: string
  mediaType: string
  musicBrainzId: string
  genres: any[]
  replayGain: IReplayGain
}

export interface IReplayGain {
  trackGain: number
  trackPeak: number
  albumPeak: number
}