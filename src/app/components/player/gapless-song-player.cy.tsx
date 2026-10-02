import { usePlayerStore } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { playbackClock } from '@/utils/playbackClock'
import { Player } from './player'

// Guards the transitionMode branch added to <Player />: the correct audio
// surface must mount for each mode. The gapless engine's audio behaviour
// (seams, crossfades, decode) is verified manually. See gapless-song-player.tsx.
describe('Gapless playback wiring', () => {
  beforeEach(() => {
    cy.mockCoverArt()
    cy.mockSongStream()
  })

  // The store persists across specs in a run; don't leak gapless mode into
  // specs that expect the stock player (e.g. player.cy.tsx).
  afterEach(() => {
    usePlayerStore.getState().settings.playback.setTransitionMode('none')
  })

  it('mounts the gapless surface (not the stock player) when enabled', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().settings.playback.setTransitionMode('gapless')
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId('gapless-ui-surface').should('exist')
      cy.getByTestId('player-song-audio').should('not.exist')

      cy.getByTestId<HTMLAudioElement>('gapless-ui-surface').should(($audio) => {
        expect($audio[0].getAttribute('src')).to.contain('stream')
      })

      // The OS media session anchor must accompany the gapless engine (its
      // Web Audio output can't anchor a session on its own).
      cy.getByTestId('media-session-keep-alive').should('exist')
    })
  })

  it('mounts the stock player (not the gapless surface) when disabled', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().settings.playback.setTransitionMode('none')
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId('player-song-audio').should('exist')
      cy.getByTestId('gapless-ui-surface').should('not.exist')

      // The stock element anchors the media session itself; no keep-alive.
      cy.getByTestId('media-session-keep-alive').should('not.exist')
    })
  })

  it('publishes the playback position to the shared clock on track dispatch', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      playbackClock.reset()
      cy.spy(playbackClock, 'setPositionMs').as('clock')

      usePlayerStore.getState().settings.playback.setTransitionMode('gapless')
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      // Cold-start dispatch seeds the clock even while paused, so synced
      // lyrics read a correct position the moment playback starts.
      cy.get('@clock').should('have.been.called')
    })
  })
})
