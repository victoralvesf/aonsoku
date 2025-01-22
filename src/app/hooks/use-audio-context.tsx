import { useCallback, useEffect, useRef } from 'react'
import { usePlayerMediaType, useReplayGainState } from '@/store/player.store'
import { logger } from '@/utils/logger'
import { ReplayGainParams } from '@/utils/replayGain'

export function useAudioContext(audio: HTMLAudioElement | null) {
  const mediaType = usePlayerMediaType()
  const { replayGainError, replayGainEnabled } = useReplayGainState()

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
      // First we need to connect the sourceNode to the gainNode
      sourceNodeRef.current.connect(gainNodeRef.current)
      // And then we can connect the gainNode to the destination
      gainNodeRef.current.connect(audioContext.destination)
    }
  }, [audio, isRadio, replayGainError])

  const resumeContext = useCallback(async () => {
    const audioContext = audioContextRef.current
    if (!audioContext || isRadio) return

    logger.info('AudioContext State', { state: audioContext.state })

    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
    if (audioContext.state === 'closed') {
      setupAudioContext()
    }
  }, [isRadio, setupAudioContext])

  const setupGain = useCallback(
    (gainValue: number, replayGain?: ReplayGainParams) => {
      if (audioContextRef.current && gainNodeRef.current) {
        const currentTime = audioContextRef.current.currentTime

        logger.info('Replay Gain Status', {
          enabled: replayGainEnabled,
          gainValue,
          ...replayGain,
        })

        gainNodeRef.current.gain.setTargetAtTime(gainValue, currentTime, 0.01)
      }
    },
    [replayGainEnabled],
  )

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
    if (audio) setupAudioContext()
  }, [audio, setupAudioContext])

  return {
    audioContextRef,
    sourceNodeRef,
    gainNodeRef,
    setupAudioContext,
    resumeContext,
    setupGain,
  }
}
