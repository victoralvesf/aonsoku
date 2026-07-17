import { usePlayerStore } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { playbackClock } from '@/utils/playbackClock'
import { Player } from './player'

// Guards the stock <AudioPlayer>'s side of the shared playback clock: while a
// song plays it must publish a high-resolution position every frame (synced
// lyrics poll it). The gapless engine's side is covered in
// gapless-song-player.cy.tsx; both players must feed the same clock.
describe('AudioPlayer playback clock wiring', () => {
  beforeEach(() => {
    cy.mockCoverArt()
    cy.mockSongStream()
    cy.stub(HTMLMediaElement.prototype, 'play').resolves()
  })

  it('publishes the element position to the shared clock while playing', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      playbackClock.reset()
      cy.spy(playbackClock, 'setPositionMs').as('clock')

      usePlayerStore.getState().settings.playback.setTransitionMode('none')
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(true)

      cy.mount(<Player />)

      cy.get('@clock').should('have.been.called')
    })
  })

  it('does not publish while paused', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      playbackClock.reset()

      usePlayerStore.getState().settings.playback.setTransitionMode('none')
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      // Give the rAF publisher a few frames; it must stay quiet when paused.
      cy.wait(100).then(() => {
        cy.spy(playbackClock, 'setPositionMs').as('clock')
        cy.wait(100)
        cy.get('@clock').should('not.have.been.called')
      })
    })
  })
})
