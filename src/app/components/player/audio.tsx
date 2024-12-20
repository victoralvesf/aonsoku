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
import { useVolumeSynchronization } from '@/app/hooks/use-volume-sync'
import {
  usePlayerActions,
  usePlayerMediaType,
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
  const gainValue = useMemo(() => {
    if (!replayGain) return 1

    return calculateReplayGain(replayGain)
  }, [replayGain])

  const isRadio = mediaType === 'radio'
  const isSong = mediaType === 'song'

  if (isSong) {
    logger.info('Replay Gain Is Active', replayGainEnabled)
  }

  const { audioContextRef, gainNodeRef, sourceNodeRef } = useAudioContext(
    audioRef.current,
  )

  const setupGain = useCallback(() => {
    if (audioContextRef.current && gainNodeRef.current) {
      logger.info('Track Replay Gain', {
        gainValue,
        ...replayGain,
      })

      gainNodeRef.current.gain.setValueAtTime(
        gainValue,
        audioContextRef.current.currentTime,
      )
    }
  }, [audioContextRef, gainNodeRef, gainValue, replayGain])

  useEffect(() => {
    if (replayGainEnabled && isSong) setupGain()
  }, [isSong, replayGainEnabled, setupGain])

  useVolumeSynchronization({
    audio: audioRef.current,
    gainNode: gainNodeRef.current,
    gainValue,
    enabled: replayGainEnabled,
  })

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
      audioRef.current.load()
    } catch (reloadError) {
      logger.error('Failed to reload audio', reloadError)
    }
  }, [replayGainError, audioRef, isRadio])

  return (
    <audio
      ref={audioRef}
      {...props}
      crossOrigin={replayGainEnabled && isSong ? 'anonymous' : undefined}
      onError={handleError}
    />
  )
}