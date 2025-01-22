import {
  ComponentPropsWithoutRef,
  RefObject,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useAudioContext } from '@/app/hooks/use-audio-context'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerMediaType,
  usePlayerVolume,
  useReplayGainActions,
  useReplayGainState,
} from '@/store/player.store'
import { logger } from '@/utils/logger'
import { calculateReplayGain, ReplayGainParams } from '@/utils/replayGain'

type AudioPlayerProps = ComponentPropsWithoutRef<'audio'> & {
  audioRef: RefObject<HTMLAudioElement>
  replayGain?: ReplayGainParams
}

export function AudioPlayer({
  audioRef,
  replayGain,
  ...props
}: AudioPlayerProps) {
  const { t } = useTranslation()
  const { replayGainEnabled, replayGainError } = useReplayGainState()
  const mediaType = usePlayerMediaType()
  const { setPlayingState } = usePlayerActions()
  const { setReplayGainEnabled, setReplayGainError } = useReplayGainActions()
  const { volume } = usePlayerVolume()
  const isPlaying = usePlayerIsPlaying()

  const isRadio = mediaType === 'radio'
  const isSong = mediaType === 'song'

  const gainValue = useMemo(() => {
    const audioVolume = volume / 100

    if (!replayGain || !replayGainEnabled) {
      return audioVolume * 1
    }
    const gain = calculateReplayGain(replayGain)

    return audioVolume * gain
  }, [replayGain, replayGainEnabled, volume])

  const {
    audioContextRef,
    gainNodeRef,
    sourceNodeRef,
    resumeContext,
    setupGain,
  } = useAudioContext(audioRef.current)

  useEffect(() => {
    async function run() {
      const audioElement = audioRef.current
      if (!audioElement) return

      if (isRadio) {
        if (isPlaying) {
          const src = audioElement.src
          audioElement.src = ''
          audioElement.src = src
          audioElement.play()
        } else {
          audioElement.pause()
        }
      }

      if (isSong) {
        if (isPlaying) {
          await resumeContext()
          audioElement.play()
        } else {
          audioElement.pause()
        }
      }
    }
    run()
  }, [isPlaying, isSong, isRadio, audioRef, resumeContext])

  useEffect(() => {
    if (isRadio || replayGainError || !audioRef.current) return

    audioRef.current.crossOrigin = 'anonymous'
    setupGain(gainValue, replayGain)
  }, [audioRef, gainValue, isRadio, replayGain, replayGainError, setupGain])

  const handleError = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    logger.error('Audio load error', {
      src: audio.src,
      networkState: audio.networkState,
      readyState: audio.readyState,
      error: audio.error,
    })

    if (isRadio) {
      toast.error(t('radios.error'))
      setPlayingState(false)
    }

    if (isSong) {
      audioContextRef.current?.close()
      gainNodeRef.current?.disconnect()
      sourceNodeRef.current?.disconnect()

      setReplayGainEnabled(false)
      setReplayGainError(true)
    }
  }, [
    audioRef,
    isRadio,
    isSong,
    t,
    setPlayingState,
    audioContextRef,
    gainNodeRef,
    sourceNodeRef,
    setReplayGainEnabled,
    setReplayGainError,
  ])

  useEffect(() => {
    if (!replayGainError) return
    if (isRadio) return

    const audio = audioRef.current
    if (!audio) return

    try {
      audio.crossOrigin = null
      audio.load()
    } catch (reloadError) {
      logger.error('Failed to reload audio', reloadError)
    }
  }, [replayGainError, audioRef, isRadio])

  return <audio ref={audioRef} {...props} onError={handleError} />
}
