export interface ReplayGainParams {
  gain: number
  peak: number
  preAmp: number
}

// https://wiki.hydrogenaud.io/index.php?title=ReplayGain_1.0_specification&section=19
export function calculateReplayGain({ gain, peak, preAmp }: ReplayGainParams) {
  const baseGain = Math.pow(10, (gain + preAmp) / 20)

  return Math.min(baseGain, 1 / peak)
}
