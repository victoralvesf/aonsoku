import { ISong } from '@/types/responses/song'
import { TrackInfo } from './track-info'

describe('TrackInfo Component', () => {
  beforeEach(() => {
    cy.mockCoverArt()
    cy.viewport('macbook-11')
  })

  it('should display track info without link', () => {
    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(
        <div className="flex items-center gap-2 w-full">
          <TrackInfo song={song} />
        </div>,
      )

      cy.getByTestId('track-image').as('trackImage')

      cy.get('@trackImage').should('be.visible')
      cy.get('@trackImage').invoke('height').should('equal', 70)
      cy.get('@trackImage').invoke('width').should('equal', 70)

      cy.getByTestId('track-title')
        .eq(1)
        .should('be.visible')
        .and('have.text', song.title)

      cy.getByTestId('track-artist-url')
        .should('be.visible')
        .and('have.text', song.artist)
        .and('have.css', 'pointer-events', 'none')
    })
  })

  it('should display track info with link', () => {
    cy.fixture('songs/random').then((songs: ISong[]) => {
      const song = songs[1]

      cy.mount(
        <div className="flex items-center gap-2 w-full">
          <TrackInfo song={song} />
        </div>,
      )

      cy.getByTestId('track-image').as('trackImage')

      cy.get('@trackImage').should('be.visible')
      cy.get('@trackImage').invoke('height').should('equal', 70)
      cy.get('@trackImage').invoke('width').should('equal', 70)

      cy.getByTestId('track-title')
        .eq(1)
        .should('be.visible')
        .and('have.text', song.title)

      cy.getByTestId('track-artist-url')
        .should('be.visible')
        .and('have.text', song.artist)
        .and('have.attr', 'href', `/library/artists/${song.artistId}`)
    })
  })

  it('should create the fullscreen button', () => {
    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(
        <div className="flex items-center gap-2 w-full">
          <TrackInfo song={song} />
        </div>,
      )

      cy.getByTestId('track-fullscreen-button')
        .should('exist')
        .and('have.css', 'opacity', '0')
    })
  })
})
