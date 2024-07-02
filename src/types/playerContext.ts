import { Radio } from './responses/radios'
import { ISong } from './responses/song'

export interface ISongList {
  shuffledList: ISong[]
  currentList: ISong[]
  currentSongIndex: number
  originalList: ISong[]
  originalSongIndex: number
  radioList: Radio[]
}

export interface IPlayerState {
  isPlaying: boolean
  isLoopActive: boolean
  isShuffleActive: boolean
  isSongStarred: boolean
  progress: number
  volume: number
  currentDuration: number
  mediaType: 'song' | 'radio'
  audioPlayerRef: HTMLAudioElement | null
}

export interface IPlayerActions {
  playSong: (song: ISong) => void
  setSongList: (songlist: ISong[], index: number, shuffle?: boolean) => void
  setIsSongStarred: (starred: boolean) => void
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
  setProgress: (progress: number) => void
  setVolume: (volume: number) => void
  setCurrentDuration: (duration: number) => void
  getCurrentSong: () => ISong
  setPlayRadio: (list: Radio[], index: number) => void
  setAudioPlayerRef: (ref: HTMLAudioElement) => void
}

export interface IPlayerContext {
  songlist: ISongList
  playerState: IPlayerState
  actions: IPlayerActions
}
