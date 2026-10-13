import { LyricsSettings } from './lyrics'
import { PlaybackConfig } from './playback'
import { ReplayGainConfig } from './replay-gain'

export function Audio() {
  return (
    <div className="space-y-4">
      <PlaybackConfig />
      <ReplayGainConfig />
      <LyricsSettings />
    </div>
  )
}
