import { ISong } from '@/types/responses/song'
import {
  calculateReplayGain,
  resolveReplayGainParams,
  type ReplayGainSettings,
} from '@/utils/replayGain'

function song(replayGain?: ISong['replayGain']): ISong {
  return { id: 'song', replayGain } as unknown as ISong
}

const settings = (
  overrides: Partial<ReplayGainSettings> = {},
): ReplayGainSettings => ({
  type: 'track',
  preAmp: 0,
  defaultGain: -6,
  ...overrides,
})

describe('replayGain', () => {
  describe('calculateReplayGain', () => {
    it('is unity for 0dB gain, no preAmp, peak 1', () => {
      expect(calculateReplayGain({ gain: 0, peak: 1, preAmp: 0 })).to.equal(1)
    })

    it('converts a negative gain to a linear cut', () => {
      // -6dB -> 10^(-6/20) ~= 0.501
      expect(calculateReplayGain({ gain: -6, peak: 1, preAmp: 0 })).to.be.closeTo(
        0.501,
        0.001,
      )
    })

    it('adds preAmp to the tag gain', () => {
      // -6dB tag + 6dB preAmp = 0dB -> unity
      expect(calculateReplayGain({ gain: -6, peak: 1, preAmp: 6 })).to.equal(1)
    })

    it('limits a boost to 1/peak to avoid clipping', () => {
      // +12dB -> ~3.98 linear, but peak 0.5 caps the multiplier at 2
      expect(calculateReplayGain({ gain: 12, peak: 0.5, preAmp: 0 })).to.equal(2)
    })

    it('does not limit when the boost stays under 1/peak', () => {
      // +6dB -> ~1.995 linear, 1/peak = 4 -> uncapped
      expect(calculateReplayGain({ gain: 6, peak: 0.25, preAmp: 0 })).to.be.closeTo(
        1.995,
        0.001,
      )
    })
  })

  describe('resolveReplayGainParams', () => {
    it('falls back to defaultGain when there is no song', () => {
      expect(resolveReplayGainParams(null, settings())).to.deep.equal({
        gain: -6,
        peak: 1,
        preAmp: 0,
      })
    })

    it('falls back to defaultGain when the song has no tags', () => {
      expect(resolveReplayGainParams(song(undefined), settings())).to.deep.equal(
        { gain: -6, peak: 1, preAmp: 0 },
      )
    })

    it('uses track tags in track mode', () => {
      const s = song({ trackGain: -3, trackPeak: 0.9 })
      expect(resolveReplayGainParams(s, settings())).to.deep.equal({
        gain: -3,
        peak: 0.9,
        preAmp: 0,
      })
    })

    it('uses album tags in album mode', () => {
      const s = song({ albumGain: -4, albumPeak: 0.8, trackGain: -3 })
      expect(
        resolveReplayGainParams(s, settings({ type: 'album' })),
      ).to.deep.equal({ gain: -4, peak: 0.8, preAmp: 0 })
    })

    it('treats a 0dB track tag as untagged (defaultGain)', () => {
      const s = song({ trackGain: 0, trackPeak: 0.9 })
      expect(resolveReplayGainParams(s, settings())).to.deep.equal({
        gain: -6,
        peak: 0.9,
        preAmp: 0,
      })
    })

    it('treats a 0dB album tag as untagged (defaultGain)', () => {
      const s = song({ albumGain: 0, albumPeak: 0.8 })
      expect(
        resolveReplayGainParams(s, settings({ type: 'album' })),
      ).to.deep.equal({ gain: -6, peak: 0.8, preAmp: 0 })
    })

    it('defaults missing tag fields (gain -> defaultGain, peak -> 1)', () => {
      const s = song({ trackPeak: undefined, trackGain: undefined })
      expect(resolveReplayGainParams(s, settings())).to.deep.equal({
        gain: -6,
        peak: 1,
        preAmp: 0,
      })
    })

    it('passes preAmp through', () => {
      const s = song({ trackGain: -3 })
      expect(
        resolveReplayGainParams(s, settings({ preAmp: 4 })).preAmp,
      ).to.equal(4)
    })
  })
})
