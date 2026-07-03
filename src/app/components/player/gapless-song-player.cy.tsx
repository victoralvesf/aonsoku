import { usePlayerStore } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { Player } from './player'

// Guards the transitionMode branch added to <Player />: the correct audio
// surface must mount for each mode. The gapless engine's audio behaviour
// (seams, crossfades, decode) is verified manually. See gapless-song-player.tsx.
describe('Gapless playback wiring', () => {
  beforeEach(() => {
    cy.mockCoverArt()
    cy.mockSongStream()
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
    })
  })
})
