import { Radio } from './responses/radios'
import { ISong } from './responses/song'

export enum LoopState {
  Off = 0,
  All = 1,
  One = 2,
}

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
  loopState: LoopState
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

export type ReplayGainType = 'track' | 'album'

interface IReplayGainData {
  enabled: boolean
  type: ReplayGainType
  preAmp: number
  error: boolean
}

interface IReplayGainActions {
  setReplayGainEnabled: (value: boolean) => void
  setReplayGainType: (value: ReplayGainType) => void
  setReplayGainPreAmp: (value: number) => void
  setReplayGainError: (value: boolean) => void
}

interface IReplayGain {
  values: IReplayGainData
  actions: IReplayGainActions
}

interface IFullscreen {
  autoFullscreenEnabled: boolean
  setAutoFullscreenEnabled: (value: boolean) => void
}

interface ILyrics {
  preferSyncedLyrics: boolean
  setPreferSyncedLyrics: (value: boolean) => void
}

export interface IPlayerSettings {
  volume: IVolumeSettings
  fullscreen: IFullscreen
  lyrics: ILyrics
  replayGain: IReplayGain
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
  playFirstSongInQueue: () => void
  handleSongEnded: () => void
  getCurrentProgress: () => number
  resetConfig: () => void
}

export interface IPlayerContext {
  songlist: ISongList
  playerState: IPlayerState
  playerProgress: IPlayerProgress
  settings: IPlayerSettings
  actions: IPlayerActions
}
