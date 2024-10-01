import { Radio } from './responses/radios'
import { ISong } from './responses/song'

export interface ISongList {
  shuffledList: ISong[]
  currentList: ISong[]
  currentSongIndex: number
  currentSong: ISong
  originalList: ISong[]
  originalSongIndex: number
  radioList: Radio[]
}

export interface IPlayerState {
  isPlaying: boolean
  isLoopActive: boolean
  isShuffleActive: boolean
  isSongStarred: boolean
  volume: number
  currentDuration: number
  mediaType: 'song' | 'radio'
  audioPlayerRef: HTMLAudioElement | null
  queueDrawerState: boolean
}

export interface IPlayerProgress {
  progress: number
}

export interface IVolumeSettings {
  min: number
  max: number
  step: number
  wheelStep: number
}

export interface IPlayerSettings {
  volume: IVolumeSettings
}

export interface IPlayerActions {
  playSong: (song: ISong) => void
  setSongList: (songlist: ISong[], index: number, shuffle?: boolean) => void
  setCurrentSong: () => void
  checkIsSongStarred: () => void
  starSongInQueue: (id: string) => void
  starCurrentSong: () => Promise<void>
  setPlayingState: (status: boolean) => void
  togglePlayPause: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  checkActiveSong: (id: string) => boolean
  playNextSong: () => void
  playPrevSong: () => void
  hasNextSong: () => boolean
  hasPrevSong: () => boolean
  isPlayingOneSong: () => boolean
  clearPlayerState: () => void
  resetProgress: () => void
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  handleVolumeWheel: (isScrollingDown: boolean) => void
  setCurrentDuration: (duration: number) => void
  setPlayRadio: (list: Radio[], index: number) => void
  setAudioPlayerRef: (ref: HTMLAudioElement) => void
  setNextOnQueue: (songlist: ISong[]) => void
  setLastOnQueue: (songlist: ISong[]) => void
  removeSongFromQueue: (id: string) => void
  setQueueDrawerState: (state: boolean) => void
}

export interface IPlayerContext {
  songlist: ISongList
  playerState: IPlayerState
  playerProgress: IPlayerProgress
  settings: IPlayerSettings
  actions: IPlayerActions
}
