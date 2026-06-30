import { ReplayGainParams } from '@/utils/replayGain'

export interface AudioBackendCallbacks {
  onPlay?: () => void
  onPause?: () => void
  onLoadedMetadata?: () => void
  onTimeUpdate?: () => void
  onEnded?: () => void
  onLoadStart?: () => void
  onError?: () => void
}

export interface AudioBackend {
  load(src: string): void
  play(): Promise<void>
  pause(): void
  seek(seconds: number): void
  getCurrentTime(): number
  getDuration(): number
  setVolume(value: number): void
  setGain?(linearGain: number, replayGain?: ReplayGainParams): void
  loop: boolean
  playbackRate: number
  resetWebAudio?(): void
  destroy(): void
}
