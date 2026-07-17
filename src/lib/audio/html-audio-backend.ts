import {
  AudioContext,
  type IAudioContext,
  type IGainNode,
  type IMediaElementAudioSourceNode,
} from 'standardized-audio-context'
import { logger } from '@/utils/logger'
import { ReplayGainParams } from '@/utils/replayGain'
import { AudioBackend, AudioBackendCallbacks } from './backend'

type IAudioSource = IMediaElementAudioSourceNode<IAudioContext>

export class HTMLAudioBackend implements AudioBackend {
  private audio: HTMLAudioElement
  private audioContextRef: IAudioContext | null = null
  private sourceNodeRef: IAudioSource | null = null
  private gainNodeRef: IGainNode<IAudioContext> | null = null
  private useWebAudio: boolean
  private eventController = new AbortController()

  constructor(callbacks: AudioBackendCallbacks = {}, useWebAudio = false) {
    this.audio = new Audio()
    this.useWebAudio = useWebAudio
    if (useWebAudio) {
      this.audio.crossOrigin = 'anonymous'
    }

    const { signal } = this.eventController
    if (callbacks.onPlay) this.audio.addEventListener('play', callbacks.onPlay, { signal })
    if (callbacks.onPause)
      this.audio.addEventListener('pause', callbacks.onPause, { signal })
    if (callbacks.onLoadedMetadata)
      this.audio.addEventListener('loadedmetadata', callbacks.onLoadedMetadata, { signal })
    if (callbacks.onTimeUpdate)
      this.audio.addEventListener('timeupdate', callbacks.onTimeUpdate, { signal })
    if (callbacks.onEnded)
      this.audio.addEventListener('ended', callbacks.onEnded, { signal })
    if (callbacks.onLoadStart)
      this.audio.addEventListener('loadstart', callbacks.onLoadStart, { signal })
    if (callbacks.onError)
      this.audio.addEventListener('error', callbacks.onError, { signal })
  }

  load(src: string): void {
    this.audio.src = src
  }

  async play(): Promise<void> {
    if (this.useWebAudio) await this.resumeAudioContext()
    return this.audio.play()
  }

  pause(): void {
    if (this.audio.networkState === this.audio.NETWORK_EMPTY) return
    this.audio.pause()
  }

  seek(seconds: number): void {
    this.audio.currentTime = seconds
  }

  getCurrentTime(): number {
    return this.audio.currentTime
  }

  getDuration(): number {
    return this.audio.duration
  }

  setVolume(value: number): void {
    this.audio.volume = value
  }

  get loop(): boolean {
    return this.audio.loop
  }

  set loop(value: boolean) {
    this.audio.loop = value
  }

  get playbackRate(): number {
    return this.audio.playbackRate
  }

  set playbackRate(value: number) {
    this.audio.playbackRate = value
  }

  get preload(): string {
    return this.audio.preload
  }

  set preload(value: string) {
    this.audio.preload = value
  }

  setGain(linearGain: number, replayGain?: ReplayGainParams): void {
    if (!this.useWebAudio) return
    this.setupAudioContext()

    if (!this.audioContextRef || !this.gainNodeRef) return

    if (!linearGain || Number.isNaN(linearGain)) {
      logger.error('Invalid gain value', { linearGain })
      return
    }

    const currentTime = this.audioContextRef.currentTime
    logger.info('Replay Gain', { linearGain, ...replayGain })
    this.gainNodeRef.gain.setValueAtTime(linearGain, currentTime)
  }

  resetWebAudio(): void {
    if (this.sourceNodeRef) {
      this.sourceNodeRef.disconnect()
      this.sourceNodeRef = null
    }
    if (this.gainNodeRef) {
      this.gainNodeRef.disconnect()
      this.gainNodeRef = null
    }
    if (this.audioContextRef) {
      this.audioContextRef.close()
      this.audioContextRef = null
    }
  }

  destroy(): void {
    // Detach all listeners before resetting the element so that cleanup-triggered
    // load/error events (e.g. React Strict Mode unmount) don't fire callbacks.
    this.eventController.abort()
    this.resetWebAudio()
    this.audio.pause()
    this.audio.src = ''
    this.audio.load()
  }

  private setupAudioContext(): void {
    if (!this.useWebAudio) return

    if (!this.audioContextRef) {
      this.audioContextRef = new AudioContext()
    }

    const ctx = this.audioContextRef

    if (!this.sourceNodeRef) {
      this.sourceNodeRef = ctx.createMediaElementSource(this.audio)
    }

    if (!this.gainNodeRef) {
      this.gainNodeRef = ctx.createGain()
      this.sourceNodeRef.connect(this.gainNodeRef)
      this.gainNodeRef.connect(ctx.destination)
    }
  }

  private async resumeAudioContext(): Promise<void> {
    const ctx = this.audioContextRef
    if (!ctx) return

    logger.info('AudioContext State', { state: ctx.state })

    if (ctx.state === 'suspended') {
      await ctx.resume()
    }
    if (ctx.state === 'closed') {
      this.setupAudioContext()
    }
  }
}
