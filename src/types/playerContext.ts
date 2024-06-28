import { Radio } from './responses/radios'
import { ISong } from './responses/song'

export interface IPlayerContext {
  shuffledSongList: ISong[]
  currentSongList: ISong[]
  currentSongIndex: number
  originalSongIndex: number
  isPlaying: boolean
  isLoopActive: boolean
  isShuffleActive: boolean
  isPlayingOneSong: boolean
  isSongStarred: boolean
  setIsSongStarred: (starred: boolean) => void
  starSongInQueue: (id: string) => void
  playSong: (song: ISong) => void
  setPlayingState: (state: boolean) => void
  setSongList: (songlist: ISong[], index: number, shuffle?: boolean) => void
  togglePlayPause: () => void
  toggleLoop: () => void
  toggleShuffle: () => void
  checkActiveSong: (id: string) => boolean
  playNextSong: () => void
  playPrevSong: () => void
  clearPlayerState: () => void
  hasNextSong: boolean
  hasPrevSong: boolean
  progress: number
  setProgress: (progress: number) => void
  currentDuration: number
  setCurrentDuration: (duration: number) => void
  getCurrentSong: () => ISong
  mediaType: 'song' | 'radio'
  radioList: Radio[]
  setPlayRadio: (list: Radio[], index: number) => void
  volume: number
  setVolume: (volume: number) => void
  starCurrentSong: () => void
}
