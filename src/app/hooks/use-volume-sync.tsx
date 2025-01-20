import { useEffect } from 'react'
import { usePlayerVolume } from '@/store/player.store'

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
  const { volume } = usePlayerVolume()

  useEffect(() => {
    if (!audio || !gainNode) return

    gainNode.gain.value = (volume / 100) * gainValue
  }, [audio, gainNode, gainValue, volume])
}
