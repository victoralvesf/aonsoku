import {
  MutableRefObject,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import {
  AudioContext,
  type IAudioBufferSourceNode,
  type IAudioContext,
  type IGainNode,
  type IMediaElementAudioSourceNode,
} from 'standardized-audio-context'
import { getSongStreamUrl } from '@/api/httpClient'
import {
  usePlaybackSettings,
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerSonglist,
  usePlayerStore,
  usePlayerVolume,
  useReplayGainState,
} from '@/store/player.store'
import { LoopState } from '@/types/playerContext'
import { ISong } from '@/types/responses/song'
import { logger } from '@/utils/logger'
import { selectStandbySong } from '@/utils/playbackTransition'
import {
  calculateReplayGain,
  resolveReplayGainParams,
} from '@/utils/replayGain'
import { manageMediaSession } from '@/utils/setMediaSession'

/**
 * Album-scoped gapless song player.
 *
 * - A cold-started track (manual selection, app start, seek, non-gapless advance) plays through the
 *   streaming <audio> element (uiRef) for an instant start.
 * - Meanwhile the track is decoded into an AudioBuffer; once ready, playback is spliced from the element
 *   to its own buffer mid-track via a short crossfade of the same audio (inaudible).
 * - Once on its buffer, the next gapless track is decoded and scheduled with source.start(boundaryTime),
 *   so every album seam is buffer -> buffer: sample-accurate, no click, no loading.
 * - If a track ends before its buffer is ready, it advances normally.
 * - Seeking restarts the buffer at the new offset (instant, in-memory) with a short anti-click fade; while
 *   still streaming, it aborts the background decode so the element's range request isn't starved (see abortDecodes).
 */

type BufferSource = IAudioBufferSourceNode<IAudioContext>
type ElementSource = IMediaElementAudioSourceNode<IAudioContext>
type ElementGain = IGainNode<IAudioContext>
type DecodedBuffer = Awaited<ReturnType<IAudioContext['decodeAudioData']>>
type ActiveSource = 'element' | 'buffer'

const BOUNDARY_EPSILON_S = 0.05
const SEEK_DEDUPE_S = 0.4

// element -> buffer splice crossfade. Short on purpose: the streaming and decoded
// copies are a few ms out of phase, so a long crossfade sags ~3dB in the middle
// (audible dip) and a 0ms hard cut steps the waveform (click). ~12ms is too brief
// to perceive as a dip, and ramps rather than steps, so there's no click.
const CROSSFADE_S = 0.012

const SEEK_FADE_S = 0.25 // seek dip half-length: old fades out, then new fades in (~2x total)
const SEEK_ANTICLICK_S = 0.012 // quick crossfade for a track change (imperceptible, no dip)

// Shared, app-lived audio graph. Persisted across mounts so that React
// StrictMode's mount/remount and toggling gapless off/on can never leave the
// one-per-element MediaElementSource pointing at a closed context.
let sharedCtx: IAudioContext | null = null
let sharedMaster: IGainNode<IAudioContext> | null = null
let elementGraphCache = new WeakMap<
  HTMLAudioElement,
  { source: ElementSource; gain: ElementGain }
>()

// Persist the singletons across Vite HMR. A hot reload re-evaluates this module and
// would reset them, but the <audio> element survives the reload. Since an element can
// only ever bind to one MediaElementSource, a fresh context would throw
// "already connected" on createMediaElementSource and the buffer clock would jump
// backwards. Restoring them lets the reload reuse the live context + element graph.
// Tree-shaken from production builds (no import.meta.hot).
if (import.meta.hot) {
  const data = import.meta.hot.data
  if (data.sharedCtx) sharedCtx = data.sharedCtx
  if (data.sharedMaster) sharedMaster = data.sharedMaster
  if (data.elementGraphCache) elementGraphCache = data.elementGraphCache
  import.meta.hot.dispose((saved) => {
    saved.sharedCtx = sharedCtx
    saved.sharedMaster = sharedMaster
    saved.elementGraphCache = elementGraphCache
  })
}

interface GaplessSongPlayerProps {
  audioRef: RefObject<HTMLAudioElement>
}

export function GaplessSongPlayer({ audioRef }: GaplessSongPlayerProps) {
  const uiRef = useRef<HTMLAudioElement>(null) // streaming + UI/transport surface
  const activeSourceRef = useRef<ActiveSource>('element')

  const ctxRef = useRef<IAudioContext | null>(null)
  const masterGainRef = useRef<IGainNode<IAudioContext> | null>(null)
  const elementGainRef = useRef<ElementGain | null>(null)
  const bufferCacheRef = useRef<Map<string, DecodedBuffer>>(new Map())
  const inflightRef = useRef<Map<string, Promise<DecodedBuffer | null>>>(
    new Map(),
  )
  const decodeControllersRef = useRef<Map<string, AbortController>>(new Map())
  const lastSeekAtRef = useRef(0)
  const elementFadeInPendingRef = useRef(false) // element dipped for a seek; fade-in once

  // Buffer-phase playback state.
  const currentSourceRef = useRef<BufferSource | null>(null)
  const currentBufferRef = useRef<DecodedBuffer | null>(null)
  const currentPlayingIdRef = useRef<string | null>(null)
  const trackStartCtxRef = useRef(0)
  const startOffsetRef = useRef(0)
  const splicingRef = useRef(false)
  const currentGainRef = useRef<IGainNode<IAudioContext> | null>(null)
  // Outgoing sources mid-fade on a seek. Tracked so unmount can tear them down
  // even when their scheduled stop/onended never fires (context suspended =
  // frozen clock).
  const fadingSourcesRef = useRef<
    Set<{ source: BufferSource; gain: IGainNode<IAudioContext> }>
  >(new Set())

  // Scheduled-seam state (buffer -> buffer).
  const nextSourceRef = useRef<BufferSource | null>(null)
  const scheduledNextIdRef = useRef<string | null>(null)
  const boundaryCtxRef = useRef<number | null>(null)
  const boundaryHandledRef = useRef(false)
  const rafRef = useRef<number | null>(null)

  const pendingOffsetRef = useRef<number | null>(null)

  const isPlayingRef = useRef(false)
  const volumeRef = useRef(100)
  const currentReplayGainRef = useRef(1) // ReplayGain multiplier for the current track
  const loopStateRef = useRef<LoopState>(LoopState.Off)
  const standbySongRef = useRef<ISong | null>(null)
  const currentSongRef = useRef<ISong | null>(null)

  const lastSeekTargetRef = useRef<number | null>(null)
  const lastWrittenProgressRef = useRef(-1) // last progress we wrote (seek detect)

  const { currentList, currentSongIndex } = usePlayerSonglist()
  const isPlaying = usePlayerIsPlaying()
  const loopState = usePlayerLoop()
  const { volume } = usePlayerVolume()
  const { transitionMode } = usePlaybackSettings()
  const {
    replayGainEnabled,
    replayGainError,
    replayGainType,
    replayGainPreAmp,
    replayGainDefaultGain,
  } = useReplayGainState()
  const isShuffleActive = usePlayerStore(
    (state) => state.playerState.isShuffleActive,
  )
  // Bumps whenever the user (re)starts playback. Lets us restart audio when the
  // same song id is re-selected from another list (progress resets to 0 but the
  // id doesn't, so the id guard below would otherwise no-op and desync).
  const playbackNonce = usePlayerStore(
    (state) => state.playerState.playbackNonce,
  )
  const lastNonceRef = useRef(playbackNonce)
  const {
    setProgress,
    setCurrentDuration,
    getCurrentProgress,
    handleSongEnded,
    setAudioPlayerRef,
  } = usePlayerActions()

  const currentSong = currentList[currentSongIndex] ?? null

  const standbySong = selectStandbySong(currentList, currentSongIndex, {
    loopState,
    transitionMode,
    isShuffleActive,
  })

  isPlayingRef.current = isPlaying
  volumeRef.current = volume
  loopStateRef.current = loopState
  standbySongRef.current = standbySong
  currentSongRef.current = currentSong

  // Write progress and record it, so the rAF loop can tell our own writes (playback,
  // seam promote, splice, buffer start) apart from a control's seek. Only the latter
  // should make the loop re-sync its timeline; adopting our own writes would clobber
  // trackStartCtx and break the gapless seam.
  const writeProgress = useCallback(
    (seconds: number) => {
      const floored = Math.floor(seconds)
      setProgress(floored)
      lastWrittenProgressRef.current = floored
    },
    [setProgress],
  )

  // ReplayGain multiplier for a song (1 = unchanged when RG is off, errored, or
  // untagged). Reuses the shared resolution + formula in utils so gapless and the
  // stock player normalize identically.
  const replayGainFor = useCallback(
    (song: ISong | null) => {
      if (!replayGainEnabled || replayGainError || !song) return 1
      return calculateReplayGain(
        resolveReplayGainParams(song, {
          type: replayGainType,
          preAmp: replayGainPreAmp,
          defaultGain: replayGainDefaultGain,
        }),
      )
    },
    [
      replayGainEnabled,
      replayGainError,
      replayGainType,
      replayGainPreAmp,
      replayGainDefaultGain,
    ],
  )

  // Output level = volume * ReplayGain. Buffer phase applies it on masterGain, which
  // can exceed unity so RG boosts work. Element phase applies it on el.volume, which is
  // clamped to [0,1], so an RG boost (>1) is capped during the short streaming window
  // and only takes full effect after the splice to buffer. Cuts (<1) always apply.
  const applyOutputGain = useCallback((level: number, gain: number) => {
    const ctx = ctxRef.current
    if (masterGainRef.current && ctx) {
      masterGainRef.current.gain.setValueAtTime(level * gain, ctx.currentTime)
    }
    const el = uiRef.current
    if (el) el.volume = Math.min(1, Math.max(0, level * gain))
  }, [])

  const ensureContext = useCallback(() => {
    if (!sharedCtx) {
      sharedCtx = new AudioContext()
      const master = sharedCtx.createGain()
      master.gain.value = volumeRef.current / 100
      master.connect(sharedCtx.destination)
      sharedMaster = master
      logger.info(
        `[gapless] AudioContext created (state=${sharedCtx.state}, vol=${(
          volumeRef.current / 100
        ).toFixed(2)})`,
      )
    }
    ctxRef.current = sharedCtx
    masterGainRef.current = sharedMaster
    return sharedCtx
  }, [])

  // Route the streaming element into the graph (once per element, cached).
  const ensureElementGraph = useCallback(() => {
    const ctx = ensureContext()
    const el = uiRef.current
    if (!el) return
    let graph = elementGraphCache.get(el)
    if (!graph) {
      let source: ElementSource
      try {
        source = ctx.createMediaElementSource(el)
      } catch (err) {
        // Element already bound to a MediaElementSource from another
        // context. Only reachable in dev after an HMR reload recreated the
        // context. Degrade to silence rather than crash the app; a page
        // reload clears the binding.
        logger.error(
          '[gapless] could not route the audio element into Web Audio (already bound to another AudioContext); gapless audio may be silent until the app reloads',
          err,
        )
        return
      }
      const gain = ctx.createGain()
      gain.gain.value = 1
      source.connect(gain)
      graph = { source, gain }
      elementGraphCache.set(el, graph)
      logger.info('[gapless] element routed into Web Audio graph')
    }
    // (Re)connect to the destination; a prior unmount cleanup disconnects it
    // (the shared context is kept open across remounts). element level is carried
    // by el.volume, so the gain bypasses masterGain.
    try {
      graph.gain.disconnect()
    } catch {
      // nothing connected
    }
    graph.gain.connect(ctx.destination)
    elementGainRef.current = graph.gain
  }, [ensureContext])

  const decode = useCallback(
    async (song: ISong): Promise<DecodedBuffer | null> => {
      const cached = bufferCacheRef.current.get(song.id)
      if (cached) return cached
      const inflight = inflightRef.current.get(song.id)
      if (inflight) return inflight

      const ctx = ensureContext()
      const controller = new AbortController()
      decodeControllersRef.current.set(song.id, controller)
      const task = (async () => {
        try {
          // Abortable so an active seek can free the connection instantly (see
          // abortDecodes). Keep it at default fetch priority: at low priority it
          // yields the connection to the element's own streaming and lands too
          // late, pushing the element->buffer splice up against the seam where it
          // becomes audible.
          const res = await fetch(getSongStreamUrl(song.id), {
            signal: controller.signal,
          })
          if (!res.ok) {
            logger.error(
              `[gapless] stream HTTP ${res.status} for "${song.title}"`,
            )
            return null
          }
          const bytes = await res.arrayBuffer()
          const buffer = await ctx.decodeAudioData(bytes)
          bufferCacheRef.current.set(song.id, buffer)
          logger.info(
            `[gapless] decoded "${song.title}" (${buffer.duration.toFixed(1)}s)`,
          )
          return buffer
        } catch (err) {
          if (controller.signal.aborted) {
            logger.info(
              `[gapless] decode aborted "${song.title}" (freeing bandwidth for seek)`,
            )
            return null
          }
          logger.error(`[gapless] decode failed "${song.title}"`, err)
          return null
        } finally {
          inflightRef.current.delete(song.id)
          decodeControllersRef.current.delete(song.id)
        }
      })()
      inflightRef.current.set(song.id, task)
      return task
    },
    [ensureContext],
  )

  const stopSource = useCallback(
    (ref: typeof currentSourceRef | typeof nextSourceRef) => {
      if (ref.current) {
        ref.current.onended = null
        try {
          ref.current.stop()
        } catch {
          // already stopped
        }
        ref.current.disconnect()
        ref.current = null
      }
    },
    [],
  )

  // Tear down the current buffer source and its splice gain (if any).
  const stopCurrent = useCallback(() => {
    stopSource(currentSourceRef)
    if (currentGainRef.current) {
      currentGainRef.current.disconnect()
      currentGainRef.current = null
    }
  }, [stopSource])

  const pauseElement = useCallback(() => {
    const el = uiRef.current
    if (el) el.pause()
  }, [])

  const armDecodeNext = useCallback(() => {
    const song = standbySongRef.current
    if (song && !bufferCacheRef.current.has(song.id)) decode(song)
  }, [decode])

  // Cancel every in-flight decode so an active seek's range request gets the
  // whole connection; a concurrent whole-file download starves it. The decode
  // re-arms once seeking settles (handleTimeUpdate).
  const abortDecodes = useCallback(() => {
    for (const controller of decodeControllersRef.current.values()) {
      controller.abort()
    }
    decodeControllersRef.current.clear()
  }, [])

  // Splice the currently-streaming element over to its decoded buffer, mid-track,
  // via a short crossfade of the same audio. Only while playing.
  const spliceToBuffer = useCallback(
    (song: ISong) => {
      if (
        activeSourceRef.current !== 'element' ||
        splicingRef.current ||
        !isPlayingRef.current ||
        currentSongRef.current?.id !== song.id
      ) {
        return
      }
      const buffer = bufferCacheRef.current.get(song.id)
      const ctx = ctxRef.current
      const el = uiRef.current
      if (!buffer || !ctx || !el || !masterGainRef.current) return

      splicingRef.current = true
      const startAt = el.currentTime
      const now = ctx.currentTime

      const source = ctx.createBufferSource()
      source.buffer = buffer
      const spliceGain = ctx.createGain()
      spliceGain.gain.setValueAtTime(0, now)
      spliceGain.gain.linearRampToValueAtTime(1, now + CROSSFADE_S)
      source.connect(spliceGain)
      spliceGain.connect(masterGainRef.current)
      source.start(now, startAt)

      if (elementGainRef.current) {
        const g = elementGainRef.current.gain
        g.cancelScheduledValues(now)
        g.setValueAtTime(1, now)
        g.linearRampToValueAtTime(0, now + CROSSFADE_S)
      }

      currentGainRef.current = spliceGain
      currentSourceRef.current = source
      currentBufferRef.current = buffer
      currentPlayingIdRef.current = song.id
      trackStartCtxRef.current = now
      startOffsetRef.current = startAt
      boundaryHandledRef.current = false
      activeSourceRef.current = 'buffer'
      setCurrentDuration(Math.floor(buffer.duration))
      writeProgress(startAt)
      logger.info(
        `[gapless] SPLICE element->buffer "${song.title}" @${startAt.toFixed(2)}s`,
      )
      // Now on the buffer -> safe to prefetch the next track (no seek contention).
      armDecodeNext()

      window.setTimeout(
        () => {
          if (activeSourceRef.current === 'buffer') el.pause()
        },
        Math.ceil(CROSSFADE_S * 1000) + 40,
      )
    },
    [setCurrentDuration, armDecodeNext, writeProgress],
  )

  // Cold start via the streaming element (instant), then splice to buffer.
  const startElementPlayback = useCallback(
    (song: ISong, offset: number) => {
      const el = uiRef.current
      if (!el) return

      stopCurrent()
      stopSource(nextSourceRef)
      scheduledNextIdRef.current = null
      boundaryCtxRef.current = null
      boundaryHandledRef.current = false
      splicingRef.current = false
      currentBufferRef.current = null

      activeSourceRef.current = 'element'
      currentPlayingIdRef.current = song.id

      const ctx = ensureContext()
      ensureElementGraph()
      if (ctx.state === 'suspended' && isPlayingRef.current) ctx.resume()
      if (elementGainRef.current) {
        const now = ctx.currentTime
        elementGainRef.current.gain.cancelScheduledValues(now)
        elementGainRef.current.gain.setValueAtTime(1, now)
      }
      el.muted = false
      // element/buffer level = volume * this track's ReplayGain.
      currentReplayGainRef.current = replayGainFor(song)
      applyOutputGain(volumeRef.current / 100, currentReplayGainRef.current)

      // Positioning the element (here, or via the pending-offset apply in
      // handleLoadedMetadata) fires its own seeking/seeked events. Mark this
      // offset as expected so handleSeek reads it as the cold-start position and
      // not a user drag; otherwise it dips elementGain to silence and aborts the
      // decode, so the track never sounds and never reaches its buffer.
      lastSeekTargetRef.current = offset
      if (el.readyState >= 1 && Number.isFinite(el.duration)) {
        try {
          el.currentTime = offset
        } catch {
          // corrected by timeupdate
        }
        pendingOffsetRef.current = null
      } else {
        pendingOffsetRef.current = offset
      }

      writeProgress(offset)
      if (isPlayingRef.current) {
        el.play().catch((err) => {
          // AbortError = play() superseded by a pause() (normal during rapid
          // state changes / resets); not a real failure.
          if (err?.name !== 'AbortError') {
            logger.error('[gapless] element play() failed', err)
          }
        })
      }
      logger.info(
        `[gapless] cold start (streaming) "${song.title}" @${offset.toFixed(1)}s (ctx=${ctx.state}, playing=${isPlayingRef.current})`,
      )

      decode(song).then((buffer) => {
        if (buffer) spliceToBuffer(song)
      })
    },
    [
      ensureContext,
      ensureElementGraph,
      decode,
      spliceToBuffer,
      writeProgress,
      stopCurrent,
      stopSource,
      replayGainFor,
      applyOutputGain,
    ],
  )

  // Start (or restart) a track from its decoded buffer (cached cold start,
  // seek restart, loop-one restart).
  const startBufferPlayback = useCallback(
    // `seek` = a within track jump (gets the noticeable dip). A track change
    // (cold start / loop restart) passes seek=false and gets only a tiny
    // imperceptible anti-click crossfade; no dip.
    async (song: ISong, offset: number, seek = false) => {
      const ctx = ensureContext()
      let buffer = bufferCacheRef.current.get(song.id) ?? null
      if (!buffer) {
        // Not cached (rare); decode first; bail if the song changed meanwhile.
        // Nothing has been mutated yet, so bailing here is safe (no stuck state).
        buffer = await decode(song)
        if (!buffer || currentSongRef.current?.id !== song.id) return
      }

      // Commit to buffer playback synchronously (no awaits past here) so the
      // play/pause effect can never start the element in an async gap.
      activeSourceRef.current = 'buffer'
      splicingRef.current = false
      pauseElement()
      stopSource(nextSourceRef)
      scheduledNextIdRef.current = null
      boundaryCtxRef.current = null

      // A seek does the Spotify-style dip (old fades out over SEEK_FADE_S, new
      // fades in over the next SEEK_FADE_S, through near-silence). A track change
      // does only a tiny anti-click crossfade. The album seam never comes through
      // here (promote uses a gain-1 source), so seams stay a sample-accurate cut.
      //
      // Only fade when the context is running: a seek while paused has a frozen
      // clock, so a scheduled ramp/stop (and its onended) would never fire, leaving
      // the outgoing source connected to bleed old audio on resume, or leak on
      // unmount. A paused change is inaudible anyway, so tear down at once.
      const now = ctx.currentTime
      const oldSource = currentSourceRef.current
      const oldGain = currentGainRef.current
      const fade = isPlayingRef.current && ctx.state === 'running'
      const outLen = seek ? SEEK_FADE_S : SEEK_ANTICLICK_S
      logger.info(
        `[gapless] buffer restart "${song.title}" @${offset.toFixed(1)}s (${seek ? 'SEEK dip' : 'track change'}, fade=${fade})`,
      )
      if (fade && oldSource && oldGain) {
        const pair = { source: oldSource, gain: oldGain }
        fadingSourcesRef.current.add(pair)
        oldGain.gain.cancelScheduledValues(now)
        oldGain.gain.setValueAtTime(oldGain.gain.value, now)
        oldGain.gain.linearRampToValueAtTime(0, now + outLen)
        oldSource.onended = () => {
          try {
            oldSource.disconnect()
            oldGain.disconnect()
          } catch {
            // already torn down
          }
          fadingSourcesRef.current.delete(pair)
        }
        try {
          oldSource.stop(now + outLen)
        } catch {
          // already stopped
        }
        currentSourceRef.current = null
        currentGainRef.current = null
      } else {
        stopCurrent()
      }

      const source = ctx.createBufferSource()
      source.buffer = buffer
      const sourceGain = ctx.createGain()
      if (fade && oldSource && seek) {
        // Seek: hold silent while the old source fades out, then fade in (dip).
        sourceGain.gain.setValueAtTime(0, now)
        sourceGain.gain.setValueAtTime(0, now + SEEK_FADE_S)
        sourceGain.gain.linearRampToValueAtTime(1, now + 2 * SEEK_FADE_S)
      } else if (fade && oldSource) {
        // Track change: quick simultaneous crossfade (anti-click).
        sourceGain.gain.setValueAtTime(0, now)
        sourceGain.gain.linearRampToValueAtTime(1, now + SEEK_ANTICLICK_S)
      } else {
        sourceGain.gain.setValueAtTime(1, now) // paused / first start
      }
      source.connect(sourceGain)
      if (masterGainRef.current) sourceGain.connect(masterGainRef.current)
      source.start(now, offset)

      currentSourceRef.current = source
      currentGainRef.current = sourceGain
      currentBufferRef.current = buffer
      currentPlayingIdRef.current = song.id
      trackStartCtxRef.current = now
      startOffsetRef.current = offset
      boundaryHandledRef.current = false
      writeProgress(offset)
      setCurrentDuration(Math.floor(buffer.duration))
      if (isPlayingRef.current) {
        if (ctx.state === 'suspended') ctx.resume()
      } else if (ctx.state === 'running') {
        // Don't sound while paused: freeze the context until play resumes it.
        ctx.suspend()
      }
      logger.info(
        `[gapless] buffer play "${song.title}" @${offset.toFixed(1)}s / ${buffer.duration.toFixed(1)}s`,
      )
      armDecodeNext()
    },
    [
      decode,
      ensureContext,
      pauseElement,
      writeProgress,
      setCurrentDuration,
      stopCurrent,
      stopSource,
      armDecodeNext,
    ],
  )

  const scheduleSeamAt = useCallback((boundaryCtx: number) => {
    const song = standbySongRef.current
    const ctx = ctxRef.current
    if (!song || !ctx || !masterGainRef.current) return
    const buffer = bufferCacheRef.current.get(song.id)
    if (!buffer || boundaryCtx <= ctx.currentTime) return

    const source = ctx.createBufferSource()
    source.buffer = buffer
    source.connect(masterGainRef.current)
    source.start(boundaryCtx)

    nextSourceRef.current = source
    boundaryCtxRef.current = boundaryCtx
    scheduledNextIdRef.current = song.id
    logger.info(
      `[gapless] SEAM scheduled "${song.title}" in +${(
        boundaryCtx - ctx.currentTime
      ).toFixed(2)}s (sample-accurate)`,
    )
  }, [])

  const promoteScheduledNext = useCallback(() => {
    const nextId = scheduledNextIdRef.current
    const buffer = bufferCacheRef.current.get(nextId ?? '') ?? null

    if (currentGainRef.current) {
      currentGainRef.current.disconnect()
      currentGainRef.current = null
    }
    currentSourceRef.current = nextSourceRef.current
    currentBufferRef.current = buffer
    currentPlayingIdRef.current = nextId
    trackStartCtxRef.current =
      boundaryCtxRef.current ?? ctxRef.current?.currentTime ?? 0
    startOffsetRef.current = 0
    activeSourceRef.current = 'buffer'

    nextSourceRef.current = null
    boundaryCtxRef.current = null
    scheduledNextIdRef.current = null
    boundaryHandledRef.current = false

    if (buffer) setCurrentDuration(Math.floor(buffer.duration))
    writeProgress(0)
    logger.info(
      '[gapless] SEAM crossed -> next buffer playing; advancing index',
    )
    handleSongEnded()
    armDecodeNext()
  }, [handleSongEnded, setCurrentDuration, writeProgress, armDecodeNext])

  // Web Audio autoplay unlock. The element is routed through the shared context
  // (element -> elementGain -> destination), so a suspended context is silent even
  // though el.play() resolves and the UI shows "playing". Contexts start suspended
  // unless created in a user gesture, and our start paths run in a useEffect (after
  // the gesture commits). So create the context up front and resume it here, from a
  // real pointer/key gesture.
  useEffect(() => {
    ensureContext()
    const unlock = () => {
      const ctx = ctxRef.current
      // Only resume when we actually intend to play. Pausing suspends the context
      // (that's how buffer-phase playback is frozen), so resuming on any gesture
      // would restart audio behind a paused UI. isPlayingRef is still false when the
      // play gesture fires (state updates next render), so the play paths own that
      // resume; this listener is just the safety net for gestures while playing.
      if (ctx && ctx.state === 'suspended' && isPlayingRef.current) {
        ctx
          .resume()
          .then(() =>
            logger.info(`[gapless] context unlocked by gesture (${ctx.state})`),
          )
          .catch((err) => logger.error('[gapless] gesture resume failed', err))
      }
    }
    document.addEventListener('pointerdown', unlock)
    document.addEventListener('keydown', unlock)
    return () => {
      document.removeEventListener('pointerdown', unlock)
      document.removeEventListener('keydown', unlock)
    }
  }, [ensureContext])

  // Cold-start dispatcher; keyed on the current song (not isPlaying). When the track
  // changes to one we're not already playing, load it (buffer if cached, else stream
  // via the element). The start paths gate el.play() / ctx.resume() on isPlayingRef,
  // so a paused or rehydrated track is set up here silently and only sounds once the
  // play/pause effect below flips isPlaying.
  useEffect(() => {
    const song = currentSong
    if (!song) {
      // Nothing loaded (e.g. the gapless toggle cleared the queue): stop the
      // element and forget the playing id so the next pick counts as new.
      if (activeSourceRef.current === 'element') uiRef.current?.pause()
      currentPlayingIdRef.current = null
      lastNonceRef.current = playbackNonce
      return
    }
    // A replay intent (user re-selected a song, even the same one, from any list)
    // bumps playbackNonce and resets progress, so we have to restart audio. Without
    // this, re-selecting the current song id would hit the guard below, leave the
    // old source playing, and desync it from the progress bar.
    const replayRequested = playbackNonce !== lastNonceRef.current
    lastNonceRef.current = playbackNonce
    if (currentPlayingIdRef.current === song.id && !replayRequested) {
      // Already loaded this track (seam advance / resume / re-render); the
      // play/pause effect owns resume; don't restart it here.
      return
    }
    logger.info(
      `[gapless] dispatch "${song.title}" (replay=${replayRequested}, playing=${isPlayingRef.current}, ctx=${ctxRef.current?.state ?? 'none'})`,
    )
    if (bufferCacheRef.current.has(song.id)) {
      startBufferPlayback(song, getCurrentProgress())
    } else {
      startElementPlayback(song, getCurrentProgress())
    }
    // isPlaying is read via isPlayingRef (not reactive): dispatch is driven by the
    // song changing or a replay intent; play/pause is the effect below.
  }, [
    currentSong,
    playbackNonce,
    startBufferPlayback,
    startElementPlayback,
    getCurrentProgress,
  ])

  // PLAY / PAUSE; keyed on isPlaying. Resume/suspend the shared context and
  // play/pause the streaming element. Buffer sources follow the context clock,
  // so suspend/resume alone starts/stops them.
  useEffect(() => {
    const ctx = ctxRef.current
    if (isPlaying) {
      if (ctx && ctx.state === 'suspended') {
        ctx
          .resume()
          .catch((err) => logger.error('[gapless] resume on play failed', err))
      }
      if (activeSourceRef.current === 'element') {
        uiRef.current?.play().catch((err) => {
          // AbortError = play() superseded by a pause() during rapid state
          // changes; not a real failure.
          if (err?.name !== 'AbortError') {
            logger.error('[gapless] play() failed', err)
          }
        })
        const song = currentSongRef.current
        if (song && bufferCacheRef.current.has(song.id)) spliceToBuffer(song)
      }
      logger.info(
        `[gapless] play (source=${activeSourceRef.current}, ctx=${ctx?.state ?? 'none'})`,
      )
    } else {
      if (activeSourceRef.current === 'element') uiRef.current?.pause()
      if (ctx && ctx.state === 'running') ctx.suspend()
      logger.info(`[gapless] pause (ctx=${ctx?.state ?? 'none'})`)
    }
  }, [isPlaying, spliceToBuffer])

  // Eager prefetch of the next gapless track + evict what we no longer need +
  // cancel a scheduled seam that is now stale.
  useEffect(() => {
    if (
      scheduledNextIdRef.current &&
      scheduledNextIdRef.current !== standbySong?.id
    ) {
      stopSource(nextSourceRef)
      scheduledNextIdRef.current = null
      boundaryCtxRef.current = null
    }
    // Prefetch the next track only once the current one is on its buffer. During the
    // streaming phase a background decode would compete with the element's seek fetch
    // and slow it down; the splice/promote/start paths call armDecodeNext the moment
    // we enter buffer phase.
    if (
      standbySong &&
      currentSong &&
      bufferCacheRef.current.has(currentSong.id) &&
      !bufferCacheRef.current.has(standbySong.id)
    ) {
      logger.info(`[gapless] prefetch next "${standbySong.title}"`)
      decode(standbySong)
    }
    const keep = new Set(
      [currentSong?.id, standbySong?.id, currentPlayingIdRef.current].filter(
        Boolean,
      ),
    )
    for (const id of Array.from(bufferCacheRef.current.keys())) {
      if (!keep.has(id)) bufferCacheRef.current.delete(id)
    }
  }, [currentSong, standbySong, decode, stopSource])

  // Volume changes: re-apply the output level (volume * the track's ReplayGain).
  useEffect(() => {
    applyOutputGain(volume / 100, currentReplayGainRef.current)
  }, [volume, applyOutputGain])

  // Recompute + apply ReplayGain when the current track changes (cold start, or
  // a gapless seam advancing currentSong) or when the RG settings change. RG is
  // per-track; on an album-mode seam it's identical across the boundary (same
  // album) so masterGain doesn't step. See applyOutputGain for the element cap.
  useEffect(() => {
    currentReplayGainRef.current = replayGainFor(currentSong)
    applyOutputGain(volumeRef.current / 100, currentReplayGainRef.current)
  }, [currentSong, replayGainFor, applyOutputGain])

  // Cancel a scheduled seam if the user switches to loop-one mid-playback.
  useEffect(() => {
    if (loopState === LoopState.One && boundaryCtxRef.current !== null) {
      stopSource(nextSourceRef)
      scheduledNextIdRef.current = null
      boundaryCtxRef.current = null
      logger.info('[gapless] loop-one enabled -> cancelled scheduled seam')
    }
  }, [loopState, stopSource])

  // Expose the hidden element as Player audioRef and store audioPlayerRef.
  // audioRef is typed RefObject (readonly `current` in the React 18 types), but the
  // parent hands it to us to populate with the real <audio> node, exactly as the
  // non-gapless <AudioPlayer> does via `ref={audioRef}`. Mirror uiRef in.
  useEffect(() => {
    const parentRef = audioRef as MutableRefObject<HTMLAudioElement | null>
    parentRef.current = uiRef.current
    if (uiRef.current) setAudioPlayerRef(uiRef.current)
    return () => {
      setAudioPlayerRef(null)
    }
  }, [audioRef, setAudioPlayerRef])

  // Buffer-phase loop: progress + pre-schedule + seam handoff, once per frame.
  useEffect(() => {
    const tick = () => {
      const ctx = ctxRef.current
      const buffer = currentBufferRef.current
      if (
        activeSourceRef.current === 'buffer' &&
        ctx &&
        buffer &&
        isPlayingRef.current
      ) {
        let position =
          startOffsetRef.current + (ctx.currentTime - trackStartCtxRef.current)
        // Adopt externally set progress (a control's seek) instead of
        // clobbering it with our stale computed position; otherwise the seek dot
        // briefly clips back to the old spot for a frame before the buffer
        // restart catches up.
        const stored = getCurrentProgress()
        if (stored !== lastWrittenProgressRef.current) {
          startOffsetRef.current = stored
          trackStartCtxRef.current = ctx.currentTime
          position = stored
        }
        const flooredPosition = Math.floor(position)
        setProgress(flooredPosition)
        lastWrittenProgressRef.current = flooredPosition
        manageMediaSession.setPositionState(buffer.duration, position)

        if (
          lastSeekTargetRef.current !== null &&
          Math.abs(position - lastSeekTargetRef.current) > 1
        ) {
          lastSeekTargetRef.current = null
        }

        const remaining = buffer.duration - position
        const standby = standbySongRef.current

        if (
          loopStateRef.current === LoopState.One &&
          remaining <= BOUNDARY_EPSILON_S &&
          !boundaryHandledRef.current
        ) {
          boundaryHandledRef.current = true
          logger.info('[gapless] loop-one restart (buffer)')
          const song = currentSongRef.current
          if (song) startBufferPlayback(song, 0)
          rafRef.current = requestAnimationFrame(tick)
          return
        }

        if (standby && remaining <= 30) armDecodeNext()
        if (
          standby &&
          boundaryCtxRef.current === null &&
          loopStateRef.current !== LoopState.One &&
          bufferCacheRef.current.has(standby.id)
        ) {
          scheduleSeamAt(
            trackStartCtxRef.current +
              (buffer.duration - startOffsetRef.current),
          )
        }

        // Scheduled seam buffer is sounding: promote + advance index (aligned to
        // the audible seam, i.e. at the boundary, not before it).
        if (
          boundaryCtxRef.current !== null &&
          !boundaryHandledRef.current &&
          loopStateRef.current !== LoopState.One &&
          ctx.currentTime >= boundaryCtxRef.current &&
          nextSourceRef.current
        ) {
          boundaryHandledRef.current = true
          promoteScheduledNext()
          rafRef.current = requestAnimationFrame(tick)
          return
        }

        // No gapless next: advance at the natural end (a normal gap is expected).
        if (
          !nextSourceRef.current &&
          boundaryCtxRef.current === null &&
          !boundaryHandledRef.current &&
          loopStateRef.current !== LoopState.One &&
          remaining <= 0
        ) {
          boundaryHandledRef.current = true
          logger.info('[gapless] non-gapless end (buffer) -> advance')
          handleSongEnded()
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [
    startBufferPlayback,
    promoteScheduledNext,
    scheduleSeamAt,
    armDecodeNext,
    handleSongEnded,
    setProgress,
    getCurrentProgress,
  ])

  const handleTimeUpdate = useCallback(() => {
    const el = uiRef.current
    if (!el || activeSourceRef.current !== 'element') return
    const position = el.currentTime
    writeProgress(position)
    if (Number.isFinite(el.duration)) {
      manageMediaSession.setPositionState(el.duration, position)
    }
    // Fade the element back in once after a seek dip, when the native seek has
    // completed (el.seeking === false) and playback has resumed. The pending flag
    // stops this from re-triggering on every timeupdate and restarting the ramp.
    const gain = elementGainRef.current
    const ctx = ctxRef.current
    if (elementFadeInPendingRef.current && gain && ctx && !el.seeking) {
      elementFadeInPendingRef.current = false
      const now = ctx.currentTime
      gain.gain.cancelScheduledValues(now)
      gain.gain.setValueAtTime(gain.gain.value, now)
      gain.gain.linearRampToValueAtTime(1, now + SEEK_FADE_S)
    }
    if (
      lastSeekTargetRef.current !== null &&
      Math.abs(position - lastSeekTargetRef.current) > 1
    ) {
      lastSeekTargetRef.current = null
    }
    // Re-arm this track's decode once seeking has settled (we abort it during a
    // seek to free bandwidth). Once decoded we splice onto the buffer and all
    // further seeks are instant in-memory jumps.
    const song = currentSongRef.current
    if (
      song &&
      !bufferCacheRef.current.has(song.id) &&
      !inflightRef.current.has(song.id) &&
      Date.now() - lastSeekAtRef.current > 800
    ) {
      decode(song).then((buffer) => {
        if (buffer) spliceToBuffer(song)
      })
    }
  }, [writeProgress, decode, spliceToBuffer])

  const handleLoadedMetadata = useCallback(() => {
    const el = uiRef.current
    if (!el || activeSourceRef.current !== 'element') return
    if (Number.isFinite(el.duration))
      setCurrentDuration(Math.floor(el.duration))
    if (pendingOffsetRef.current != null) {
      try {
        el.currentTime = pendingOffsetRef.current
      } catch {
        // ignore
      }
      pendingOffsetRef.current = null
    }
  }, [setCurrentDuration])

  const handleEnded = useCallback(() => {
    if (activeSourceRef.current !== 'element') return
    logger.info('[gapless] element ended (pre-splice) -> advance')
    handleSongEnded()
  }, [handleSongEnded])

  // Seek. Read the target from uiRef.currentTime (set synchronously by the control),
  // not store progress, which the rAF can clobber mid-seek.
  const handleSeek = useCallback(() => {
    const el = uiRef.current
    const song = currentSongRef.current
    if (!el || !song) return
    const target = el.currentTime
    if (
      lastSeekTargetRef.current !== null &&
      Math.abs(target - lastSeekTargetRef.current) < SEEK_DEDUPE_S
    ) {
      logger.info(
        `[gapless] seek ignored @${target.toFixed(1)}s (cold-start/dupe, expected ${lastSeekTargetRef.current.toFixed(1)}s)`,
      )
      return
    }
    lastSeekTargetRef.current = target

    stopSource(nextSourceRef)
    scheduledNextIdRef.current = null
    boundaryCtxRef.current = null
    boundaryHandledRef.current = false

    logger.info(
      `[gapless] seek -> ${target.toFixed(1)}s (${activeSourceRef.current}, cached=${bufferCacheRef.current.has(song.id)})`,
    )
    if (bufferCacheRef.current.has(song.id)) {
      // Buffer is in memory -> instant in-memory jump (works in element phase too
      // by switching to the buffer). seek=true -> gets the noticeable dip.
      startBufferPlayback(song, target, true)
    } else {
      // Buffer not ready yet: the element does a native (network) range seek.
      // Abort the background decode so that seek gets the whole connection;
      // otherwise the concurrent whole-file download starves it. The decode
      // re-arms once seeking settles (handleTimeUpdate).
      lastSeekAtRef.current = Date.now()
      abortDecodes()
      // Seek dip (streaming phase): fade the element out now; handleTimeUpdate
      // fades it back in once the native seek completes and playback resumes.
      const gain = elementGainRef.current
      const ctx = ctxRef.current
      if (gain && ctx && isPlayingRef.current) {
        const now = ctx.currentTime
        gain.gain.cancelScheduledValues(now)
        gain.gain.setValueAtTime(gain.gain.value, now)
        gain.gain.linearRampToValueAtTime(0, now + SEEK_FADE_S)
        elementFadeInPendingRef.current = true
        logger.info('[gapless] element seek dip-out')
      }
    }
  }, [startBufferPlayback, stopSource, abortDecodes])

  const handleError = useCallback(() => {
    const el = uiRef.current
    logger.error('[gapless] element error', {
      src: el?.src,
      networkState: el?.networkState,
      error: el?.error,
    })
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      stopCurrent()
      stopSource(nextSourceRef)
      // Tear down any source still mid-fade (its scheduled stop may never fire if
      // the context is suspended), so nothing leaks on the shared graph.
      for (const { source, gain } of fadingSourcesRef.current) {
        try {
          source.onended = null
          source.stop()
          source.disconnect()
          gain.disconnect()
        } catch {
          // already stopped/disconnected
        }
      }
      fadingSourcesRef.current.clear()
      // Pause the streaming element and detach it from the shared destination so a
      // mid-stream toggle-off can't leave it sounding alongside the <AudioPlayer>
      // that takes over. Don't close the shared context: it's reused across remounts
      // so the one-per-element MediaElementSource is never orphaned, and
      // ensureElementGraph reconnects the gain on the next mount.
      uiRef.current?.pause()
      try {
        elementGainRef.current?.disconnect()
      } catch {
        // already disconnected
      }
    }
  }, [stopCurrent, stopSource])

  return (
    <audio
      ref={uiRef}
      crossOrigin="anonymous"
      preload="metadata"
      src={currentSong ? getSongStreamUrl(currentSong.id) : undefined}
      loop={loopState === LoopState.One}
      onLoadedMetadata={handleLoadedMetadata}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      onSeeking={handleSeek}
      onSeeked={handleSeek}
      onError={handleError}
      data-testid="gapless-ui-surface"
    />
  )
}
