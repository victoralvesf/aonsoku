import { ReactNode, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { getSongStreamUrl } from '@/api/httpClient'
import { getProxyURL } from '@/api/podcastClient'
import { podcasts } from '@/service/podcasts'
import { useAppMediaCache } from '@/store/app.store'
import {
  getVolume,
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerMediaType,
  usePlayerSonglist,
  usePlayerStore,
  usePlayerVolume,
  useReplayGainActions,
  useReplayGainState,
} from '@/store/player.store'
import { LoopState } from '@/types/playerContext'
import { ensureSupportForAlac } from '@/utils/alac'
import { logger } from '@/utils/logger'
import { calculateReplayGain, ReplayGainParams } from '@/utils/replayGain'
import { AudioBackendContext } from './audio-backend-context'
import { HTMLAudioBackend } from './html-audio-backend'

export function AudioBackendProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const {
    setCurrentDuration,
    setProgress,
    setPlayingState,
    handleSongEnded,
    getCurrentProgress,
    getCurrentPodcastProgress,
  } = usePlayerActions()
  const { setReplayGainEnabled, setReplayGainError } = useReplayGainActions()
  const { currentList, currentSongIndex, radioList, podcastList } =
    usePlayerSonglist()
  const isPlaying = usePlayerIsPlaying()
  const { isSong, isRadio, isPodcast } = usePlayerMediaType()
  const loopState = usePlayerLoop()
  const currentPlaybackRate = usePlayerStore().playerState.currentPlaybackRate
  const {
    replayGainType,
    replayGainPreAmp,
    replayGainDefaultGain,
    replayGainEnabled,
    replayGainError,
  } = useReplayGainState()
  const { volume } = usePlayerVolume()
  const mediaCacheEnabled = useAppMediaCache()

  const song = currentList[currentSongIndex]
  const radio = radioList[currentSongIndex]
  const podcast = podcastList[currentSongIndex]
  const songId = song?.id

  const songStreamUrl = useMemo(() => {
    if (!songId) return ''

    const cacheBustToken = mediaCacheEnabled ? undefined : Date.now().toString()

    return getSongStreamUrl(
      songId,
      undefined,
      ensureSupportForAlac(song.suffix),
      cacheBustToken,
    )
  }, [songId, song, mediaCacheEnabled])

  const trackReplayGain = useMemo<ReplayGainParams>(() => {
    const preAmp = replayGainPreAmp
    const defaultGain = replayGainDefaultGain

    if (!song || !song.replayGain) {
      return { gain: defaultGain, peak: 1, preAmp }
    }

    if (replayGainType === 'album') {
      let { albumGain = defaultGain, albumPeak = 1 } = song.replayGain

      if (albumGain === 0) {
        albumGain = defaultGain
      }

      return { gain: albumGain, peak: albumPeak, preAmp }
    }

    let { trackGain = defaultGain, trackPeak = 1 } = song.replayGain

    if (trackGain === 0) {
      trackGain = defaultGain
    }
    return { gain: trackGain, peak: trackPeak, preAmp }
  }, [song, replayGainDefaultGain, replayGainPreAmp, replayGainType])

  const handlersRef = useRef({
    setupDuration: () => {},
    setupProgress: () => {},
    setupInitialVolume: () => {},
    handleSongEnded: () => {},
    sendFinishProgress: () => {},
    handleSongError: () => {},
    handleRadioError: () => {},
  })

  const songBackend = useRef<HTMLAudioBackend | null>(null)
  const radioBackend = useRef<HTMLAudioBackend | null>(null)
  const podcastBackend = useRef<HTMLAudioBackend | null>(null)

  if (!songBackend.current) {
    songBackend.current = new HTMLAudioBackend(
      {
        onPlay: () => setPlayingState(true),
        onPause: () => setPlayingState(false),
        onLoadedMetadata: () => handlersRef.current.setupDuration(),
        onTimeUpdate: () => handlersRef.current.setupProgress(),
        onEnded: () => handlersRef.current.handleSongEnded(),
        onLoadStart: () => handlersRef.current.setupInitialVolume(),
        onError: () => handlersRef.current.handleSongError(),
      },
      !replayGainError,
    )
  }

  if (!radioBackend.current) {
    radioBackend.current = new HTMLAudioBackend({
      onPlay: () => setPlayingState(true),
      onPause: () => setPlayingState(false),
      onLoadStart: () => handlersRef.current.setupInitialVolume(),
      onError: () => handlersRef.current.handleRadioError(),
    })
  }

  if (!podcastBackend.current) {
    podcastBackend.current = new HTMLAudioBackend({
      onPlay: () => setPlayingState(true),
      onPause: () => setPlayingState(false),
      onLoadedMetadata: () => handlersRef.current.setupDuration(),
      onTimeUpdate: () => handlersRef.current.setupProgress(),
      onEnded: () => {
        handlersRef.current.sendFinishProgress()
        handlersRef.current.handleSongEnded()
      },
      onLoadStart: () => handlersRef.current.setupInitialVolume(),
    })
    podcastBackend.current.preload = 'auto'
  }

  useEffect(() => {
    return () => {
      songBackend.current?.destroy()
      radioBackend.current?.destroy()
      podcastBackend.current?.destroy()
    }
  }, [])

  const getActiveBackend = useCallback((): HTMLAudioBackend => {
    if (isRadio) return radioBackend.current!
    if (isPodcast) return podcastBackend.current!
    return songBackend.current!
  }, [isPodcast, isRadio])

  const setupDuration = useCallback(() => {
    const backend = getActiveBackend()
    const audioDuration = Math.floor(backend.getDuration())
    const infinityDuration = audioDuration === Infinity

    if (!infinityDuration) {
      setCurrentDuration(audioDuration)
    } else if (isSong && song?.duration) {
      setCurrentDuration(song.duration)
    }

    if (isPodcast && infinityDuration && podcast) {
      setCurrentDuration(podcast.duration)
    }

    if (isPodcast) {
      const podcastProgress = getCurrentPodcastProgress()

      logger.info('[Player] - Resuming episode from:', {
        seconds: podcastProgress,
      })

      setProgress(podcastProgress)
      backend.seek(podcastProgress)
    } else {
      const progress = getCurrentProgress()
      backend.seek(progress)
    }
  }, [
    getActiveBackend,
    isPodcast,
    isSong,
    song,
    podcast,
    setCurrentDuration,
    getCurrentPodcastProgress,
    setProgress,
    getCurrentProgress,
  ])

  const setupProgress = useCallback(() => {
    const currentProgress = Math.floor(getActiveBackend().getCurrentTime())
    setProgress(currentProgress)
  }, [getActiveBackend, setProgress])

  const setupInitialVolume = useCallback(() => {
    getActiveBackend().setVolume(getVolume() / 100)
  }, [getActiveBackend])

  const sendFinishProgress = useCallback(() => {
    if (!isPodcast || !podcast) return

    podcasts
      .saveEpisodeProgress(podcast.id, podcast.duration)
      .then(() => {
        logger.info('Complete progress sent:', podcast.duration)
      })
      .catch((error) => {
        logger.error('Error sending complete progress', error)
      })
  }, [isPodcast, podcast])

  const handleSongError = useCallback(() => {
    toast.error(t('warnings.songError'))

    if (replayGainEnabled || !replayGainError) {
      setReplayGainEnabled(false)
      setReplayGainError(true)
      window.location.reload()
    }
  }, [
    replayGainEnabled,
    replayGainError,
    setReplayGainEnabled,
    setReplayGainError,
    t,
  ])

  const handleRadioError = useCallback(() => {
    toast.error(t('radios.error'))
    setPlayingState(false)
  }, [setPlayingState, t])

  handlersRef.current = {
    setupDuration,
    setupProgress,
    setupInitialVolume,
    handleSongEnded,
    sendFinishProgress,
    handleSongError,
    handleRadioError,
  }

  const gainValue = useMemo(() => {
    const audioVolume = volume / 100

    if (!trackReplayGain || !replayGainEnabled) {
      return audioVolume
    }

    return audioVolume * calculateReplayGain(trackReplayGain)
  }, [trackReplayGain, replayGainEnabled, volume])

  // Load song src when it changes
  useEffect(() => {
    if (!songId || !songStreamUrl) return
    songBackend.current!.load(songStreamUrl)
  }, [songStreamUrl, songId])

  // Load radio src when stream changes
  useEffect(() => {
    if (!radio?.streamUrl) return
    radioBackend.current!.load(radio.streamUrl)
  }, [radio?.streamUrl])

  // Load podcast src when episode changes
  useEffect(() => {
    if (!podcast?.audio_url) return
    podcastBackend.current!.load(getProxyURL(podcast.audio_url))
  }, [podcast?.audio_url])

  // Pause backends that are not active when media type switches
  useEffect(() => {
    if (!isSong) songBackend.current?.pause()
    if (!isRadio) radioBackend.current?.pause()
    if (!isPodcast) podcastBackend.current?.pause()
  }, [isSong, isRadio, isPodcast])

  // Song loop
  useEffect(() => {
    songBackend.current!.loop = loopState === LoopState.One
  }, [loopState])

  // Podcast playback rate
  useEffect(() => {
    if (!isPodcast) return
    podcastBackend.current!.playbackRate = currentPlaybackRate
  }, [currentPlaybackRate, isPodcast])

  // Reset Web Audio nodes when replayGain errors
  useEffect(() => {
    if (replayGainError) songBackend.current?.resetWebAudio()
  }, [replayGainError])

  // Apply ReplayGain
  useEffect(() => {
    if (!isSong || replayGainError) return
    songBackend.current!.setGain(gainValue, trackReplayGain)
  }, [gainValue, isSong, replayGainError, trackReplayGain])

  // Play/pause — song
  // biome-ignore lint/correctness/useExhaustiveDependencies: songStreamUrl re-triggers play on track change
  useEffect(() => {
    async function handle() {
      try {
        if (isPlaying) {
          await songBackend.current!.play()
        } else {
          songBackend.current!.pause()
        }
      } catch (error) {
        logger.error('Audio playback failed', error)
        handlersRef.current.handleSongError()
      }
    }
    if (isSong) handle()
  }, [isPlaying, isSong, songStreamUrl])

  // Play/pause — radio (reloads stream each play for fresh connection)
  useEffect(() => {
    async function handle() {
      const backend = radioBackend.current!
      try {
        if (isPlaying && radio?.streamUrl) {
          backend.load(radio.streamUrl)
          await backend.play()
        } else {
          backend.pause()
        }
      } catch (error) {
        logger.error('Radio playback failed', error)
        handlersRef.current.handleRadioError()
      }
    }
    if (isRadio) handle()
  }, [isPlaying, isRadio, radio?.streamUrl])

  // Play/pause — podcast
  // biome-ignore lint/correctness/useExhaustiveDependencies: podcast?.audio_url re-triggers play on episode change
  useEffect(() => {
    async function handle() {
      try {
        if (isPlaying) {
          await podcastBackend.current!.play()
        } else {
          podcastBackend.current!.pause()
        }
      } catch (error) {
        logger.error('Podcast playback failed', error)
      }
    }
    if (isPodcast) handle()
  }, [isPlaying, isPodcast, podcast?.audio_url])

  const contextValue = useMemo(
    () => ({
      songBackend: songBackend.current!,
      radioBackend: radioBackend.current!,
      podcastBackend: podcastBackend.current!,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  return (
    <AudioBackendContext.Provider value={contextValue}>
      {children}
    </AudioBackendContext.Provider>
  )
}
