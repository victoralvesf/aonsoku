import { ISong } from '@/types/responses/song'
import { HeaderItem } from './header-item'

describe('HeaderItem Component', () => {
  beforeEach(() => {
    cy.mockCoverArt()
  })

  it('mounts the component and show the song', () => {
    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(<HeaderItem song={song} />)

      cy.getByTestId('header-bg').should('have.css', 'background-image')

      cy.getByTestId('header-title').should('have.text', song.title)
      cy.getByTestId('header-artist').should('have.text', song.artist)

      cy.getByTestId('header-genre').should('have.text', song.genre)
      cy.getByTestId('header-year').should('have.text', song.year)
      cy.getByTestId('header-duration').should('have.text', '05:33')
    })
  })

  it('should reduce image size on hd displays', () => {
    cy.viewport(1280, 720)

    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(<HeaderItem song={song} />)

      cy.getByTestId('header-image').invoke('width').should('equal', 152)
      cy.getByTestId('header-image').invoke('height').should('equal', 152)
    })
  })

  it('should keep image size on full hd displays', () => {
    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(<HeaderItem song={song} />)

      cy.getByTestId('header-image').invoke('width').should('equal', 252)
      cy.getByTestId('header-image').invoke('height').should('equal', 252)
    })
  })
})
