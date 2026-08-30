import { ReplayGainType } from '@/types/playerContext'
import { ISong } from '@/types/responses/song'

export interface ReplayGainParams {
  gain: number
  peak: number
  preAmp: number
}

export interface ReplayGainSettings {
  type: ReplayGainType
  preAmp: number
  defaultGain: number
}

// https://wiki.hydrogenaud.io/index.php?title=ReplayGain_1.0_specification&section=19
export function calculateReplayGain({ gain, peak, preAmp }: ReplayGainParams) {
  const baseGain = Math.pow(10, (gain + preAmp) / 20)

  return Math.min(baseGain, 1 / peak)
}

// Resolve the effective ReplayGain params for a song from the user's settings
// (album vs track gain, with sensible fallbacks for missing/zero tags).
//
// SHARED by BOTH players on purpose. ReplayGain is a transport-level concern;
// one constant gain applied to the audio output; so the stock streaming
// <AudioPlayer> and the gapless Web-Audio engine must derive the SAME multiplier
// from the SAME tags; only WHERE it is applied differs (the element's gain node
// vs the gapless masterGain). Keeping the resolution here (alongside
// calculateReplayGain) means a tag-handling fix or formula change lands in both
// players at once, and they can never drift apart. This is the maintainable line:
// share the pure computation, let each player own only its output wiring.
export function resolveReplayGainParams(
  song: ISong | null | undefined,
  { type, preAmp, defaultGain }: ReplayGainSettings,
): ReplayGainParams {
  if (!song || !song.replayGain) {
    return { gain: defaultGain, peak: 1, preAmp }
  }

  if (type === 'album') {
    let { albumGain = defaultGain, albumPeak = 1 } = song.replayGain

    if (albumGain === 0) {
      albumGain = defaultGain
    }

    return { gain: albumGain, peak: albumPeak, preAmp }
  }

  let { trackGain = defaultGain, trackPeak = 1 } = song.replayGain

  if (trackGain === 0) {
    trackGain = defaultGain
  }
  return { gain: trackGain, peak: trackPeak, preAmp }
}
