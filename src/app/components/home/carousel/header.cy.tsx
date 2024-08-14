import { ISong } from '@/types/responses/song'
import HomeHeader from './header'

describe('HomeHeader Component', () => {
  it('should not show component if songs list is empty', () => {
    cy.mount(<HomeHeader songs={[]} />)

    cy.get('[data-testid=header-carousel]').should('not.exist')
  })

  it('mounts the component and shows the songs correctly', () => {
    cy.intercept('/rest/getCoverArt**', { fixture: 'coverArt.jpeg' })

    cy.fixture('songs/random').then((songs: ISong[]) => {
      cy.mount(<HomeHeader songs={songs} />)

      songs.forEach((song, index) => {
        cy.get(`[data-testid=carousel-header-song-${index}]`).as(
          'activeCarousel',
        )

        cy.get('@activeCarousel')
          .find('[data-testid=header-bg]')
          .should('have.css', 'background-image')

        cy.get('@activeCarousel')
          .find('[data-testid=header-title]')
          .should('have.text', song.title)

        cy.get('@activeCarousel')
          .find('[data-testid=header-artist]')
          .should('have.text', song.artist)

        cy.get('@activeCarousel')
          .find('[data-testid=header-genre]')
          .should('have.text', song.genre)

        cy.get('@activeCarousel')
          .find('[data-testid=header-year]')
          .should('have.text', song.year)
      })

      cy.get('[data-testid=header-carousel-previous]')
        .should('be.visible')
        .and('be.enabled')
      cy.get('[data-testid=header-carousel-next]')
        .should('be.visible')
        .and('be.enabled')
    })
  })
})
