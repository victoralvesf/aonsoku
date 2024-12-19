import { useEffect } from 'react'

interface VolumeSyncParams {
  audio: HTMLAudioElement | null
  gainNode: GainNode | null
  gainValue: number
  enabled: boolean
}

export function useVolumeSynchronization({
  audio,
  gainNode,
  gainValue,
  enabled,
}: VolumeSyncParams) {
  useEffect(() => {
    if (!audio || !gainNode || !enabled) return

    const handleVolumeChange = () => {
      gainNode.gain.value = audio.volume * gainValue
    }

    audio.addEventListener('volumechange', handleVolumeChange)
    handleVolumeChange()

    return () => {
      audio.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [audio, enabled, gainNode, gainValue])
}
