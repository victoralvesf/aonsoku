import { usePlayerStore } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { Player } from './player'

describe('Player Component', () => {
  beforeEach(() => {
    cy.mockCoverArt()
    cy.mockSongStream()
  })

  it('should mount the player and interact with it', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId('player-button-play').as('playButton')
      cy.get('@playButton').should('be.visible')

      cy.getByTestId<HTMLAudioElement>('player-song-audio').then(($audio) => {
        const $el = $audio[0]

        cy.stub($el, 'load').as('loadStub')
        cy.stub($el, 'play').as('playStub')
        cy.stub($el, 'pause').as('pauseStub')

        $el.removeAttribute('autoplay')
      })

      cy.getByTestId('player-current-time').should('have.text', '00:00')
      cy.getByTestId('player-duration-time').should('have.text', '03:27')

      cy.get('@playButton').click()
      cy.get('@playStub').should('have.been.called')

      cy.getByTestId('player-button-pause').as('pauseButton')
      cy.get('@pauseButton').should('be.visible')

      cy.get('@pauseButton').click()
      cy.get('@pauseStub').should('have.been.called')

      cy.get('@playButton').should('be.visible')

      cy.getByTestId('player-button-shuffle')
        .should('be.visible')
        .and('not.have.attr', 'disabled')

      cy.getByTestId('player-button-prev')
        .should('be.visible')
        .and('have.attr', 'disabled', 'disabled')

      cy.getByTestId('player-button-next')
        .should('be.visible')
        .and('not.have.attr', 'disabled')

      cy.getByTestId('player-button-loop')
        .should('be.visible')
        .and('not.have.attr', 'disabled')
    })
  })

  it('should mount the player with a single song', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().actions.setSongList([songs[1]], 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId('player-button-shuffle')
        .should('be.visible')
        .and('have.attr', 'disabled', 'disabled')

      cy.getByTestId('player-button-prev')
        .should('be.visible')
        .and('have.attr', 'disabled', 'disabled')

      cy.getByTestId('player-button-next')
        .should('be.visible')
        .and('have.attr', 'disabled', 'disabled')

      cy.getByTestId('player-button-loop')
        .should('be.visible')
        .and('not.have.attr', 'disabled')
    })
  })

  it('should mount the player with the last song on a list', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().actions.setSongList(songs, songs.length - 1)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId('player-button-shuffle')
        .should('be.visible')
        .and('have.attr', 'disabled', 'disabled')

      cy.getByTestId('player-button-prev')
        .should('be.visible')
        .and('not.have.attr', 'disabled')

      cy.getByTestId('player-button-next')
        .should('be.visible')
        .and('have.attr', 'disabled', 'disabled')

      cy.getByTestId('player-button-loop')
        .should('be.visible')
        .and('not.have.attr', 'disabled')
    })
  })

  it('should mount the player and change the volume', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().actions.setSongList([songs[1]], 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId<HTMLAudioElement>('player-song-audio').should(($audio) => {
        const $el = $audio[0]

        expect($el.volume).to.equal(1)
      })

      cy.getByTestId('player-volume-slider').click()

      cy.getByTestId<HTMLAudioElement>('player-song-audio').should(($audio) => {
        const $el = $audio[0]

        expect($el.volume).to.equal(0.5)
      })

      cy.getByTestId('player-volume-slider').click(20, 4)

      cy.getByTestId<HTMLAudioElement>('player-song-audio').should(($audio) => {
        const $el = $audio[0]

        expect($el.volume).to.equal(0.16)
      })
    })
  })

  it('should mount the player and toggle the shuffle button', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId('player-button-shuffle')
        .as('shuffleButton')
        .should('be.visible')
        .and('not.have.class', 'player-button-active')

      cy.get('@shuffleButton').click()

      cy.get('@shuffleButton')
        .should('have.class', 'player-button-active')
        .then(() => {
          const songListAfterShuffle =
            usePlayerStore.getState().songlist.currentList

          cy.wrap(songListAfterShuffle).should('not.deep.equal', songs)
          cy.wrap(songListAfterShuffle).should('have.members', songs)
        })
    })
  })

  it('should mount the player and toggle the loop button', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId('player-button-loop')
        .as('loopButton')
        .should('be.visible')
        .and('not.have.class', 'player-button-active')

      cy.getByTestId<HTMLAudioElement>('player-song-audio').then(($audio) => {
        const $el = $audio[0]

        expect($el.loop, 'Loop state should be false').to.equal(false)
      })

      cy.get('@loopButton').click()

      cy.get('@loopButton').should('have.class', 'player-button-active')

      cy.getByTestId<HTMLAudioElement>('player-song-audio').then(($audio) => {
        const $el = $audio[0]

        expect($el.loop, 'Loop state should be true').to.equal(true)
      })
    })
  })

  it('should mount the player and change the progress slider', () => {
    cy.intercept('/rest/scrobble**', { statusCode: 200 }).as('scrobbleRequest')

    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)
      usePlayerStore.getState().actions.setProgress(207 / 2)

      cy.mount(<Player />)

      cy.getByTestId('player-current-time').should('have.text', '01:43')
      cy.getByTestId('player-duration-time').should('have.text', '03:27')

      cy.wait('@scrobbleRequest').then((interception) => {
        expect(interception.request.method, 'Request method').to.equal('GET')
        expect(interception.response?.statusCode, 'Status code').to.equal(200)
      })
    })
  })

  it('should mount the player and like the song', () => {
    cy.intercept('/rest/star**', { statusCode: 200 }).as('starRequest')

    cy.fixture('songs/random').then((songs: ISong[]) => {
      usePlayerStore.getState().actions.setSongList(songs, 0)
      usePlayerStore.getState().actions.setPlayingState(false)

      cy.mount(<Player />)

      cy.getByTestId('player-like-icon')
        .should('be.visible')
        .and('not.have.class', 'text-red-500')
        .and('not.have.class', 'fill-red-500')

      cy.getByTestId('player-like-button').click()

      cy.wait('@starRequest').then((interception) => {
        expect(interception.request.method, 'Request method').to.equal('GET')
        expect(interception.response?.statusCode, 'Status code').to.equal(200)
      })

      cy.getByTestId('player-like-icon')
        .should('be.visible')
        .and('have.class', 'text-red-500')
        .and('have.class', 'fill-red-500')
    })
  })
})
