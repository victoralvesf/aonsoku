import { createContext, useContext } from 'react'
import { usePlayerMediaType } from '@/store/player.store'
import { AudioBackend } from './backend'

interface AudioBackendContextValue {
  songBackend: AudioBackend
  radioBackend: AudioBackend
  podcastBackend: AudioBackend
}

export const AudioBackendContext =
  createContext<AudioBackendContextValue | null>(null)

export function useAudioBackend(): AudioBackendContextValue {
  const ctx = useContext(AudioBackendContext)
  if (!ctx)
    throw new Error('useAudioBackend must be used within AudioBackendProvider')
  return ctx
}

export function useActiveAudioBackend(): AudioBackend {
  const { songBackend, radioBackend, podcastBackend } = useAudioBackend()
  const { isRadio, isPodcast } = usePlayerMediaType()

  if (isRadio) return radioBackend
  if (isPodcast) return podcastBackend
  return songBackend
}
