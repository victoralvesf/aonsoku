import { ISong } from '@/types/responses/song'
import { HeaderItem } from './header-item'

describe('HeaderItem Component', () => {
  it('mounts the component and show the song', () => {
    cy.intercept('/rest/getCoverArt**', { fixture: 'coverArt.jpeg' })

    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(<HeaderItem song={song} />)

      cy.get('[data-testid=header-bg]').should('have.css', 'background-image')

      cy.get('[data-testid=header-title]').should('have.text', song.title)
      cy.get('[data-testid=header-artist]').should('have.text', song.artist)

      cy.get('[data-testid=header-genre]').should('have.text', song.genre)
      cy.get('[data-testid=header-year]').should('have.text', song.year)
      cy.get('[data-testid=header-duration]').should('have.text', '05:33')
    })
  })

  it('should reduce image size on hd displays', () => {
    cy.viewport(1280, 720)

    cy.intercept('/rest/getCoverArt**', { fixture: 'coverArt.jpeg' })

    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(<HeaderItem song={song} />)

      cy.get('[data-testid=header-image]').invoke('width').should('equal', 152)
      cy.get('[data-testid=header-image]').invoke('height').should('equal', 152)
    })
  })

  it('should keep image size on full hd displays', () => {
    cy.intercept('/rest/getCoverArt**', { fixture: 'coverArt.jpeg' })

    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(<HeaderItem song={song} />)

      cy.get('[data-testid=header-image]').invoke('width').should('equal', 252)
      cy.get('[data-testid=header-image]').invoke('height').should('equal', 252)
    })
  })
})
