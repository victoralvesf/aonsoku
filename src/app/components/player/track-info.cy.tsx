import { ReactNode } from 'react'
import { ISong } from '@/types/responses/song'
import { TrackInfo } from './track-info'

function Wrapper({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2 w-full">{children}</div>
}

describe('TrackInfo Component', () => {
  beforeEach(() => {
    cy.mockCoverArt()
    cy.viewport('macbook-11')
  })

  it('should display track info without link', () => {
    cy.fixture('songs/song').then((song: ISong) => {
      cy.mount(
        <Wrapper>
          <TrackInfo song={song} />
        </Wrapper>,
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
        <Wrapper>
          <TrackInfo song={song} />
        </Wrapper>,
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

  describe('English', () => {
    beforeEach(() => {
      cy.changeLang('en-US')
    })

    it('should display a message if no audio is playing', () => {
      cy.mount(
        <Wrapper>
          <TrackInfo song={undefined} />
        </Wrapper>,
      )

      cy.getByTestId('song-no-playing-icon')
        .should('be.visible')
        .and('have.class', 'lucide-audio-lines')

      cy.getByTestId('song-no-playing-label')
        .should('be.visible')
        .and('have.text', 'No song playing')
    })

    it('should create the fullscreen button and show tooltip', () => {
      cy.fixture('songs/song').then((song: ISong) => {
        cy.mount(
          <Wrapper>
            <TrackInfo song={song} />
          </Wrapper>,
        )

        cy.getByTestId('track-fullscreen-button')
          .should('exist')
          .and('have.css', 'opacity', '0')

        cy.getByTestId('track-fullscreen-button').wait(1500).realHover()
        cy.contains('Switch to fullscreen').should('be.visible')
      })
    })
  })

  describe('Portuguese', () => {
    beforeEach(() => {
      cy.changeLang('pt-BR')
    })

    it('should display a message if no audio is playing', () => {
      cy.mount(
        <Wrapper>
          <TrackInfo song={undefined} />
        </Wrapper>,
      )

      cy.getByTestId('song-no-playing-icon')
        .should('be.visible')
        .and('have.class', 'lucide-audio-lines')

      cy.getByTestId('song-no-playing-label')
        .should('be.visible')
        .and('have.text', 'Nenhuma música tocando')
    })

    it('should create the fullscreen button and show tooltip', () => {
      cy.fixture('songs/song').then((song: ISong) => {
        cy.mount(
          <Wrapper>
            <TrackInfo song={song} />
          </Wrapper>,
        )

        cy.getByTestId('track-fullscreen-button')
          .should('exist')
          .and('have.css', 'opacity', '0')

        cy.getByTestId('track-fullscreen-button').wait(1500).realHover()
        cy.contains('Mudar para tela cheia').should('be.visible')
      })
    })
  })
})
