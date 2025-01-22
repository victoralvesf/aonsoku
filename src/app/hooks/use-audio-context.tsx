import { useCallback, useEffect, useRef } from 'react'
import {
  usePlayerIsPlaying,
  usePlayerMediaType,
  useReplayGainState,
} from '@/store/player.store'
import { logger } from '@/utils/logger'

export function useAudioContext(audio: HTMLAudioElement | null) {
  const isPlaying = usePlayerIsPlaying()
  const mediaType = usePlayerMediaType()
  const { replayGainError } = useReplayGainState()

  const isRadio = mediaType === 'radio'

  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const setupAudioContext = useCallback(() => {
    if (!audio || isRadio || replayGainError) return

    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext()
    }

    const audioContext = audioContextRef.current

    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContext.createGain()
      gainNodeRef.current.connect(audioContext.destination)
    }

    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect()
      sourceNodeRef.current = null
    }

    sourceNodeRef.current = audioContext.createMediaElementSource(audio)
    sourceNodeRef.current.connect(gainNodeRef.current)
  }, [audio, isRadio, replayGainError])

  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect()
        sourceNodeRef.current = null
      }
      if (gainNodeRef.current) {
        gainNodeRef.current.disconnect()
        gainNodeRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const audioContext = audioContextRef.current
    if (!audioContext || isRadio) return

    logger.info('AudioContext State', { state: audioContext.state })

    if (isPlaying && audioContext.state === 'suspended') {
      try {
        audioContext.resume()
        logger.info('Resuming AudioContext', audioContext.state)
      } catch (_) {
        logger.error('Unable to resume AudioContext')
      }
    }
  }, [isPlaying, isRadio])

  useEffect(() => {
    if (audio) setupAudioContext()
  }, [audio, setupAudioContext])

  return {
    audioContextRef,
    sourceNodeRef,
    gainNodeRef,
    setupAudioContext,
  }
}
