import { useCallback, useEffect, useRef } from 'react'
import {
  AudioContext,
  type IAudioContext,
  type IMediaElementAudioSourceNode,
  type IGainNode,
} from 'standardized-audio-context'
import { usePlayerMediaType, useReplayGainState } from '@/store/player.store'
import { logger } from '@/utils/logger'
import { isLinux } from '@/utils/osType'
import { ReplayGainParams } from '@/utils/replayGain'

type IAudioSource = IMediaElementAudioSourceNode<IAudioContext>

export function useAudioContext(audio: HTMLAudioElement | null) {
  const { isSong } = usePlayerMediaType()
  const { replayGainError, replayGainEnabled } = useReplayGainState()

  const audioContextRef = useRef<IAudioContext | null>(null)
  const sourceNodeRef = useRef<IAudioSource | null>(null)
  const gainNodeRef = useRef<IGainNode<IAudioContext> | null>(null)

  const setupAudioContext = useCallback(() => {
    if (!audio || !isSong || replayGainError || isLinux) return

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
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
  }, [audio, isSong, replayGainError])

  const resumeContext = useCallback(async () => {
    const audioContext = audioContextRef.current
    if (!audioContext || !isSong || isLinux) return

    logger.info('AudioContext State', { state: audioContext.state })

    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
    if (audioContext.state === 'closed') {
      setupAudioContext()
    }
  }, [isSong, setupAudioContext])

  const setupGain = useCallback(
    (gainValue: number, replayGain?: ReplayGainParams) => {
      if (audioContextRef.current && gainNodeRef.current) {
        const currentTime = audioContextRef.current.currentTime

        logger.info('Replay Gain Status', {
          enabled: replayGainEnabled,
          gainValue,
          ...replayGain,
        })

        gainNodeRef.current.gain.setValueAtTime(gainValue, currentTime)
      }
    },
    [replayGainEnabled],
  )

  function resetRefs() {
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

  useEffect(() => {
    if (replayGainError) resetRefs()
  }, [replayGainError])

  useEffect(() => {
    return () => resetRefs()
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
    resetRefs,
  }
}
