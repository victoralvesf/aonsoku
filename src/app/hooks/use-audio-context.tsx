import { useCallback, useEffect, useRef } from 'react'
import { usePlayerIsPlaying, useReplayGainState } from '@/store/player.store'
import { logger } from '@/utils/logger'

export function useAudioContext(audio: HTMLAudioElement | null) {
  const isPlaying = usePlayerIsPlaying()
  const { replayGainEnabled } = useReplayGainState()

  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const setupAudioContext = useCallback(async () => {
    if (!audio) return

    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext()
    }

    const audioContext = audioContextRef.current

    logger.info('AudioContext State', audioContext.state)
    if (isPlaying && audioContext.state === 'suspended') {
      try {
        await audioContext.resume()
        logger.info('Resuming AudioContext', audioContext.state)
      } catch (_) {
        logger.error('Unable to resume AudioContext')
      }
    }

    if (!sourceNodeRef.current) {
      sourceNodeRef.current = audioContext.createMediaElementSource(audio)
    }

    if (!gainNodeRef.current) {
      gainNodeRef.current = audioContext.createGain()
      sourceNodeRef.current.connect(gainNodeRef.current)
      gainNodeRef.current.connect(audioContext.destination)
    }
  }, [audio, isPlaying])

  useEffect(() => {
    if (!replayGainEnabled) return

    if (audio) setupAudioContext()
  }, [audio, setupAudioContext, replayGainEnabled])

  return {
    audioContextRef,
    sourceNodeRef,
    gainNodeRef,
    setupAudioContext,
  }
}
