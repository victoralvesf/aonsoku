import { manageMediaSession } from '@/utils/setMediaSession'

// Covers the setPositionState guards added for the gapless player. The real
// Media Session API is stubbed; these tests assert what reaches the browser.
describe('manageMediaSession.setPositionState', () => {
  beforeEach(() => {
    cy.stub(navigator.mediaSession, 'setPositionState').as('setPositionState')
  })

  it('forwards duration, position and default playbackRate', () => {
    manageMediaSession.setPositionState(100, 50)

    cy.get('@setPositionState').should('have.been.calledWithMatch', {
      duration: 100,
      position: 50,
      playbackRate: 1,
    })
  })

  it('passes a custom playbackRate through', () => {
    manageMediaSession.setPositionState(100, 10, 1.5)

    cy.get('@setPositionState').should('have.been.calledWithMatch', {
      playbackRate: 1.5,
    })
  })

  it('clamps a negative position to 0', () => {
    manageMediaSession.setPositionState(100, -5)

    cy.get('@setPositionState').should('have.been.calledWithMatch', {
      position: 0,
    })
  })

  it('clamps a position past the end to the duration', () => {
    manageMediaSession.setPositionState(100, 150)

    cy.get('@setPositionState').should('have.been.calledWithMatch', {
      position: 100,
    })
  })

  it('skips a non-finite duration (streaming metadata not ready)', () => {
    manageMediaSession.setPositionState(Number.POSITIVE_INFINITY, 10)
    manageMediaSession.setPositionState(Number.NaN, 10)

    cy.get('@setPositionState').should('not.have.been.called')
  })

  it('skips a zero or negative duration', () => {
    manageMediaSession.setPositionState(0, 0)
    manageMediaSession.setPositionState(-1, 0)

    cy.get('@setPositionState').should('not.have.been.called')
  })
})
