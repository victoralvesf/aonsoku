import { logger } from '@/utils/logger'
import { AudioBackend, AudioBackendCallbacks } from './backend'

/**
 * macOS-only AudioBackend that delegates to a native AVPlayer process via
 * Electron IPC. Commands are fire-and-forget; events arrive asynchronously
 * through the avplayer-event channel and are cached locally so that the
 * synchronous getCurrentTime() / getDuration() methods remain fast.
 */
export class AVPlayerBackend implements AudioBackend {
  private _currentTime = 0
  private _duration = NaN
  private _loop = false
  private _playbackRate = 1.0
  private _volume = 1.0
  private removeListener: (() => void) | null = null
  private readonly callbacks: AudioBackendCallbacks

  constructor(
    private readonly id: string,
    callbacks: AudioBackendCallbacks = {},
  ) {
    this.callbacks = callbacks
    logger.info(`[AVPlayerBackend:${id}] created`)
    this.registerListener()
  }

  private registerListener(): void {
    this.removeListener = window.api.avPlayer.onEvent((event) => {
      if (event.id !== this.id) return
      switch (event.type) {
        case 'play':
          this.callbacks.onPlay?.()
          break
        case 'pause':
          this.callbacks.onPause?.()
          break
        case 'timeupdate':
          this._currentTime = event.time ?? this._currentTime
          this.callbacks.onTimeUpdate?.()
          break
        case 'loadedmetadata':
          this._duration = event.duration ?? NaN
          this.callbacks.onLoadedMetadata?.()
          break
        case 'ended':
          this.callbacks.onEnded?.()
          break
        case 'loadstart':
          this._currentTime = 0
          this._duration = NaN
          this.callbacks.onLoadStart?.()
          break
        case 'error':
          logger.error(`[AVPlayerBackend:${this.id}] error event`, event)
          this.callbacks.onError?.()
          break
      }
    })
  }

  // Remove the IPC listener without destroying the helper player. Used by the
  // provider's effect cleanup to survive React Strict Mode's simulated unmount.
  detachListener(): void {
    this.removeListener?.()
    this.removeListener = null
  }

  // Re-register the IPC listener after it was removed by detachListener.
  reconnect(): void {
    if (!this.removeListener) {
      this.registerListener()
    }
  }

  load(src: string): void {
    logger.info(`[AVPlayerBackend:${this.id}] load`, { src })
    this._currentTime = 0
    this._duration = NaN
    window.api.avPlayer.command({ type: 'load', id: this.id, url: src })
  }

  play(): Promise<void> {
    logger.info(`[AVPlayerBackend:${this.id}] play`)
    window.api.avPlayer.command({ type: 'play', id: this.id })
    return Promise.resolve()
  }

  pause(): void {
    window.api.avPlayer.command({ type: 'pause', id: this.id })
  }

  seek(seconds: number): void {
    this._currentTime = seconds
    window.api.avPlayer.command({ type: 'seek', id: this.id, seconds })
  }

  getCurrentTime(): number {
    return this._currentTime
  }

  getDuration(): number {
    return this._duration
  }

  setVolume(value: number): void {
    this._volume = Math.max(0, Math.min(1.0, value))
    window.api.avPlayer.command({
      type: 'setVolume',
      id: this.id,
      value: this._volume,
    })
  }

  // AVPlayer has no separate gain stage; the caller has already combined
  // volume and ReplayGain into a single linear factor.
  setGain(linearGain: number): void {
    this._volume = Math.max(0, Math.min(1.0, linearGain))
    window.api.avPlayer.command({
      type: 'setVolume',
      id: this.id,
      value: this._volume,
    })
  }

  get loop(): boolean {
    return this._loop
  }

  // Looping is handled in the provider's onEnded callback (seek to 0 + play).
  // HTMLAudioBackend uses the native <audio>.loop attribute instead.
  set loop(value: boolean) {
    this._loop = value
  }

  get playbackRate(): number {
    return this._playbackRate
  }

  set playbackRate(value: number) {
    this._playbackRate = value
    window.api.avPlayer.command({ type: 'setRate', id: this.id, rate: value })
  }

  destroy(): void {
    this.removeListener?.()
    this.removeListener = null
    window.api.avPlayer.command({ type: 'destroy', id: this.id })
  }
}
