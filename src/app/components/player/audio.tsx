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
import { isLinux } from '@/utils/osType'
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

  const { resumeContext, setupGain } = useAudioContext(audioRef.current)

  useEffect(() => {
    if (isRadio || replayGainError || !audioRef.current || isLinux) return

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
      setReplayGainEnabled(false)
      setReplayGainError(true)
      window.location.reload()
    }
  }, [
    audioRef,
    isRadio,
    isSong,
    t,
    setPlayingState,
    setReplayGainEnabled,
    setReplayGainError,
  ])

  useEffect(() => {
    async function run() {
      try {
        const audio = audioRef.current
        if (!audio) return

        if (isRadio) {
          if (isPlaying) {
            const src = audio.src
            if (!src) throw new Error('Audio source is missing.')
            audio.src = ''
            audio.src = src
            await audio.play()
          } else {
            audio.pause()
          }
        }

        if (isSong) {
          if (isPlaying) {
            if (!audio.src) throw new Error('Audio source is missing.')
            await resumeContext()
            await audio.play()
          } else {
            audio.pause()
          }
        }
      } catch (error) {
        logger.error('Audio playback failed', error)
        handleError()
      }
    }
    run()
  }, [isPlaying, isSong, isRadio, audioRef, resumeContext, handleError])

  return <audio ref={audioRef} {...props} onError={handleError} />
}
