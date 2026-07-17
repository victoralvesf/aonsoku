import { usePlayerStore } from '@/store/player.store'
import { MediaSessionKeepAlive } from './media-session-keep-alive'

// The keep-alive must mirror the store's isPlaying onto a real (not muted)
// looping element: that element is what anchors the OS media session while the
// gapless engine plays through Web Audio. Playback itself is stubbed; the
// wiring is what matters here.
describe('MediaSessionKeepAlive', () => {
  beforeEach(() => {
    cy.stub(HTMLMediaElement.prototype, 'play').as('play').resolves()
    cy.stub(HTMLMediaElement.prototype, 'pause').as('pause')
  })

  it('renders a looping, unmuted, silent clip', () => {
    usePlayerStore.getState().actions.setPlayingState(false)

    cy.mount(<MediaSessionKeepAlive />)

    cy.getByTestId<HTMLAudioElement>('media-session-keep-alive').should(
      ($audio) => {
        const el = $audio[0]
        expect(el.loop, 'loop').to.equal(true)
        expect(el.muted, 'muted (must stay false to anchor)').to.equal(false)
        expect(el.src, 'silent generated clip').to.match(/^blob:/)
      },
    )
    cy.get('@play').should('not.have.been.called')
  })

  it('plays when the store starts playback and pauses when it stops', () => {
    usePlayerStore.getState().actions.setPlayingState(true)

    cy.mount(<MediaSessionKeepAlive />)

    cy.get('@play')
      .should('have.been.called')
      .then(() => {
        usePlayerStore.getState().actions.setPlayingState(false)
      })

    cy.get('@pause').should('have.been.called')
  })
})
