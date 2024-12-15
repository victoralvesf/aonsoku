import {
  ComponentPropsWithoutRef,
  RefObject,
  useCallback,
  useEffect,
  useRef,
} from 'react'
import { usePlayerIsPlaying } from '@/store/player.store'

type AudioPlayerProps = ComponentPropsWithoutRef<'audio'> & {
  audioRef: RefObject<HTMLAudioElement>
  replayGain?: number
}

const DEFAULT_REPLAY_GAIN = -6

export function AudioPlayer({
  audioRef,
  replayGain = DEFAULT_REPLAY_GAIN,
  ...props
}: AudioPlayerProps) {
  const isPlaying = usePlayerIsPlaying()
  const audioContextRef = useRef<AudioContext | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  const gainValue = Math.pow(10, replayGain / 20)

  const setup = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    if (!audioContextRef.current) {
      audioContextRef.current = new window.AudioContext()
    }

    const audioContext = audioContextRef.current

    console.log(audioContext.state)
    if (isPlaying && audioContext.state === 'suspended') {
      try {
        console.log('AUDIO CONTEXT IS SUSPENDED, RESUMING NOW')
        await audioContext.resume()
      } catch (_) {
        console.error('UNABLE TO RESUME AUDIO CONTEXT', audioContext)
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

    console.log('AUDIO REPLAY GAIN VALUE', replayGain)
    console.log('PLAYER GAIN VALUE', gainValue)

    gainNodeRef.current.gain.value = gainValue
  }, [audioRef, gainValue, isPlaying, replayGain])

  useEffect(() => {
    setup()

    const audio = audioRef.current
    if (!audio) return

    const handleVolumeChange = () => {
      if (gainNodeRef.current) {
        // Sync native volume with Web Audio API gain
        gainNodeRef.current.gain.value = audio.volume * gainValue
      }
    }

    audio.addEventListener('volumechange', handleVolumeChange)

    handleVolumeChange()

    // Cleanup
    return () => {
      audio.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [audioRef, gainValue, replayGain, setup, isPlaying])

  return <audio ref={audioRef} {...props} />
}
