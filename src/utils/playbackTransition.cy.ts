import { LoopState } from '@/types/playerContext'
import { ISong } from '@/types/responses/song'
import {
  isSameAlbumConsecutive,
  resolveTransition,
  selectNextSong,
  selectStandbySong,
  type StandbySettings,
  type TransitionSettings,
} from '@/utils/playbackTransition'

function song(overrides: Partial<ISong>): ISong {
  return {
    id: 'song',
    albumId: 'album-1',
    discNumber: 1,
    track: 1,
    ...overrides,
  } as unknown as ISong
}

const enabled: TransitionSettings = {
  transitionMode: 'gapless',
  isShuffleActive: false,
}

describe('playbackTransition', () => {
  describe('isSameAlbumConsecutive', () => {
    it('true for same album + disc and next track', () => {
      const a = song({ albumId: 'a', discNumber: 1, track: 1 })
      const b = song({ albumId: 'a', discNumber: 1, track: 2 })
      expect(isSameAlbumConsecutive(a, b)).to.equal(true)
    })

    it('false across albums', () => {
      const a = song({ albumId: 'a', track: 1 })
      const b = song({ albumId: 'b', track: 2 })
      expect(isSameAlbumConsecutive(a, b)).to.equal(false)
    })

    it('false when track is not consecutive', () => {
      const a = song({ albumId: 'a', discNumber: 1, track: 1 })
      const b = song({ albumId: 'a', discNumber: 1, track: 3 })
      expect(isSameAlbumConsecutive(a, b)).to.equal(false)
    })

    it('false across discs', () => {
      const a = song({ albumId: 'a', discNumber: 1, track: 1 })
      const b = song({ albumId: 'a', discNumber: 2, track: 2 })
      expect(isSameAlbumConsecutive(a, b)).to.equal(false)
    })
  })

  describe('resolveTransition', () => {
    const a = song({ albumId: 'a', discNumber: 1, track: 1 })
    const b = song({ albumId: 'a', discNumber: 1, track: 2 })

    it('gapless when enabled, album-consecutive, not shuffled', () => {
      const result = resolveTransition(a, b, enabled)
      expect(result.kind).to.equal('gapless')
      expect(result.fadeMs).to.equal(0)
    })

    it('none when shuffled', () => {
      const result = resolveTransition(a, b, { ...enabled, isShuffleActive: true })
      expect(result.kind).to.equal('none')
    })

    it('none when transitionMode is off', () => {
      const result = resolveTransition(a, b, { ...enabled, transitionMode: 'none' })
      expect(result.kind).to.equal('none')
    })

    it('none across albums even when enabled', () => {
      const other = song({ albumId: 'b', track: 2 })
      expect(resolveTransition(a, other, enabled).kind).to.equal('none')
    })

    it('none when either song is null', () => {
      expect(resolveTransition(null, b, enabled).kind).to.equal('none')
      expect(resolveTransition(a, null, enabled).kind).to.equal('none')
    })
  })

  describe('selectNextSong', () => {
    const list = [
      song({ id: '1', track: 1 }),
      song({ id: '2', track: 2 }),
      song({ id: '3', track: 3 }),
    ]

    it('returns the following track mid-list', () => {
      expect(selectNextSong(list, 0, LoopState.Off)?.id).to.equal('2')
    })

    it('returns null at the end of the queue with loop off', () => {
      expect(selectNextSong(list, 2, LoopState.Off)).to.equal(null)
    })

    it('wraps to the first track at the end with loop all', () => {
      expect(selectNextSong(list, 2, LoopState.All)?.id).to.equal('1')
    })

    it('returns null in loop-one (the track never advances)', () => {
      expect(selectNextSong(list, 0, LoopState.One)).to.equal(null)
    })

    it('returns null for an empty list', () => {
      expect(selectNextSong([], 0, LoopState.All)).to.equal(null)
    })
  })

  describe('selectStandbySong', () => {
    const base: StandbySettings = {
      loopState: LoopState.Off,
      transitionMode: 'gapless',
      isShuffleActive: false,
    }
    const album = [
      song({ id: '1', albumId: 'a', discNumber: 1, track: 1 }),
      song({ id: '2', albumId: 'a', discNumber: 1, track: 2 }),
    ]

    it('returns the next track when album-consecutive and enabled', () => {
      expect(selectStandbySong(album, 0, base)?.id).to.equal('2')
    })

    it('null when shuffled', () => {
      expect(
        selectStandbySong(album, 0, { ...base, isShuffleActive: true }),
      ).to.equal(null)
    })

    it('null when the transition mode is off', () => {
      expect(
        selectStandbySong(album, 0, { ...base, transitionMode: 'none' }),
      ).to.equal(null)
    })

    it('null when the next track is a different album', () => {
      const mixed = [
        song({ id: '1', albumId: 'a', track: 1 }),
        song({ id: '2', albumId: 'b', track: 2 }),
      ]
      expect(selectStandbySong(mixed, 0, base)).to.equal(null)
    })

    it('null in loop-one (no next track to pre-warm)', () => {
      expect(
        selectStandbySong(album, 0, { ...base, loopState: LoopState.One }),
      ).to.equal(null)
    })

    it('null at the end of the queue with loop off', () => {
      expect(selectStandbySong(album, 1, base)).to.equal(null)
    })

    it('null when a loop-all wrap lands on a non-consecutive track', () => {
      // Wrapping past the end returns index 0 (track 1); the album's last track
      // is not its predecessor, so no seam is pre-warmed.
      expect(
        selectStandbySong(album, 1, { ...base, loopState: LoopState.All }),
      ).to.equal(null)
    })
  })
})
