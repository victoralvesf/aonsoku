import { useEffect } from 'react'

interface VolumeSyncParams {
  audio: HTMLAudioElement | null
  gainNode: GainNode | null
  gainValue: number
}

export function useVolumeSynchronization({
  audio,
  gainNode,
  gainValue,
}: VolumeSyncParams) {
  useEffect(() => {
    if (!audio || !gainNode) return
    const controller = new AbortController()

    const handleVolumeChange = () => {
      gainNode.gain.value = audio.volume * gainValue
    }

    handleVolumeChange()
    audio.addEventListener('volumechange', handleVolumeChange, {
      signal: controller.signal,
    })

    return () => {
      controller.abort()
    }
  }, [audio, gainNode, gainValue])
}
