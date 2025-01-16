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
  const { replayGainEnabled, replayGainError } = useReplayGainState()

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

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContext.createMediaElementSource(audio)
    }

    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContext.createGain()
      sourceNodeRef.current.connect(gainNodeRef.current)
      gainNodeRef.current.connect(audioContext.destination)
    }
  }, [audio, isRadio, replayGainError])

  useEffect(() => {
    const audioContext = audioContextRef.current
    if (!audioContext) return

    logger.info('AudioContext State', audioContext.state)

    if (isPlaying && audioContext.state === 'suspended') {
      try {
        audioContext.resume()
        logger.info('Resuming AudioContext', audioContext.state)
      } catch (_) {
        logger.error('Unable to resume AudioContext')
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (audio) setupAudioContext()
  }, [audio, setupAudioContext, replayGainEnabled])

  return {
    audioContextRef,
    sourceNodeRef,
    gainNodeRef,
    setupAudioContext,
  }
}
