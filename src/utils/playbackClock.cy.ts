import { playbackClock } from '@/utils/playbackClock'

describe('playbackClock', () => {
  beforeEach(() => {
    playbackClock.reset()
  })

  it('starts at zero', () => {
    expect(playbackClock.getPositionMs()).to.equal(0)
  })

  it('returns the last published position', () => {
    playbackClock.setPositionMs(1234.5)
    expect(playbackClock.getPositionMs()).to.equal(1234.5)

    playbackClock.setPositionMs(98765)
    expect(playbackClock.getPositionMs()).to.equal(98765)
  })

  it('reset clears the position', () => {
    playbackClock.setPositionMs(5000)
    playbackClock.reset()
    expect(playbackClock.getPositionMs()).to.equal(0)
  })
})
