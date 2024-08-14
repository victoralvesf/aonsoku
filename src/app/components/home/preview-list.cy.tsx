import omit from 'lodash/omit'
import { Albums } from '@/types/responses/album'
import PreviewList from './preview-list'

describe('PreviewList Component', () => {
  const componentProps = {
    title: 'Most played',
    moreRoute: '/most-played',
    moreTitle: 'See more',
  }

  beforeEach(() => {
    cy.intercept('/rest/getCoverArt**', { fixture: 'coverArt.jpeg' })
  })

  it('should mounts the component and show the albums', () => {
    cy.fixture('albums/mostPlayed').then((albums: Albums[]) => {
      cy.mount(
        <PreviewList
          list={albums}
          title={componentProps.title}
          showMore={true}
          moreRoute={componentProps.moreRoute}
          moreTitle={componentProps.moreTitle}
        />,
      )

      cy.get('[data-testid=preview-list-title]').should(
        'have.text',
        componentProps.title,
      )

      cy.get('[data-testid=preview-list-show-more]')
        .should('have.text', componentProps.moreTitle)
        .and('have.attr', 'href', componentProps.moreRoute)

      cy.get('[data-testid=preview-list-prev-button]').as('prevButton')
      cy.get('[data-testid=preview-list-next-button]').as('nextButton')

      cy.get('@prevButton').should('exist').and('be.visible')
      cy.get('@nextButton').should('exist').and('be.visible')

      albums.forEach((album, index) => {
        cy.get(`[data-testid=preview-list-carousel-item-${index}]`).as(
          'activeCarousel',
        )

        if (index === 8) {
          cy.get('[data-testid=preview-list-next-button]').click()
        }

        cy.get('@activeCarousel')
          .find('[data-testid=song-card-image]')
          .should('have.attr', 'alt', album.name)

        cy.get('@activeCarousel')
          .find('[data-testid=song-card-album-title]')
          .should('have.text', album.title)

        cy.get('@activeCarousel')
          .find('[data-testid=song-card-artist]')
          .should('have.text', album.artist)
      })
    })
  })

  it('should mounts the component but not show the more route', () => {
    cy.fixture('albums/mostPlayed').then((albums: Albums[]) => {
      cy.mount(
        <PreviewList
          list={albums}
          title={componentProps.title}
          showMore={false}
          moreRoute={componentProps.moreRoute}
          moreTitle={componentProps.moreTitle}
        />,
      )

      cy.get('[data-testid=preview-list-title]').should(
        'have.text',
        componentProps.title,
      )

      cy.get('[data-testid=preview-list-show-more]').should('not.exist')

      cy.get('[data-testid=preview-list-prev-button]')
        .should('exist')
        .and('be.visible')

      cy.get('[data-testid=preview-list-next-button]')
        .should('exist')
        .and('be.visible')
    })
  })

  it('should increase albums size on HD displays', () => {
    cy.viewport(1280, 720)

    cy.fixture('albums/mostPlayed').then((albums: Albums[]) => {
      cy.mount(
        <PreviewList
          list={albums}
          title={componentProps.title}
          showMore={false}
          moreRoute={componentProps.moreRoute}
          moreTitle={componentProps.moreTitle}
        />,
      )

      albums.forEach((_, index) => {
        cy.get(`[data-testid=preview-list-carousel-item-${index}]`).should(
          'have.css',
          'flex-basis',
          '20%',
        )
      })
    })
  })

  it('should create links for albums with artistId', () => {
    cy.fixture('albums/mostPlayed').then((albums: Albums[]) => {
      cy.mount(
        <PreviewList
          list={albums}
          title={componentProps.title}
          showMore={true}
          moreRoute={componentProps.moreRoute}
          moreTitle={componentProps.moreTitle}
        />,
      )

      albums.forEach((_, index) => {
        cy.get(`[data-testid=preview-list-carousel-item-${index}]`).as(
          'activeCarousel',
        )

        cy.get('@activeCarousel')
          .find('[data-testid=song-card-artist]')
          .should('exist')
        cy.get('@activeCarousel')
          .find('[data-testid=song-card-artist-link]')
          .should('exist')
      })
    })
  })

  it('should not create links for albums without artistId', () => {
    cy.fixture('albums/mostPlayed').then((albums: Albums[]) => {
      const albumsWithoutArtistId = albums.map(
        (album) => omit(album, 'artistId') as Albums,
      )

      cy.mount(
        <PreviewList
          list={albumsWithoutArtistId}
          title={componentProps.title}
          showMore={true}
          moreRoute={componentProps.moreRoute}
          moreTitle={componentProps.moreTitle}
        />,
      )

      albums.forEach((_, index) => {
        cy.get(`[data-testid=preview-list-carousel-item-${index}]`).as(
          'activeCarousel',
        )

        cy.get('@activeCarousel')
          .find('[data-testid=song-card-artist]')
          .should('exist')
        cy.get('@activeCarousel')
          .find('[data-testid=song-card-artist-link]')
          .should('not.exist')
      })
    })
  })
})
