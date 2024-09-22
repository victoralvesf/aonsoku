import { getCoverArtUrl } from '@/api/httpClient'
import { SingleAlbum } from '@/types/responses/album'
import { PreviewCard } from './card'

function Wrapper({ children }: { children: React.ReactNode }) {
  return <div className="m-16 w-[300px] h-[400px] relative">{children}</div>
}

describe('PreviewCard Component', () => {
  beforeEach(() => {
    cy.mockCoverArt()
  })

  it('should display the image and create the image link', () => {
    cy.fixture('albums/album').then((album: SingleAlbum) => {
      cy.mount(
        <Wrapper>
          <PreviewCard.Root>
            <PreviewCard.ImageWrapper link="/test">
              <PreviewCard.Image
                src={getCoverArtUrl(album.coverArt, 'album')}
                alt={album.name}
              />
            </PreviewCard.ImageWrapper>
          </PreviewCard.Root>
        </Wrapper>,
      )

      cy.getByTestId('card-image-link').should('have.attr', 'href', '/test')

      cy.getByTestId('card-image')
        .should('exist')
        .and('have.attr', 'alt', album.name)
    })
  })

  it('should use hover play button correctly', () => {
    cy.fixture('albums/album').then((album: SingleAlbum) => {
      const onClickSpy = cy.spy().as('onClickSpy')

      cy.mount(
        <Wrapper>
          <PreviewCard.Root>
            <PreviewCard.ImageWrapper link="/test">
              <PreviewCard.Image
                src={getCoverArtUrl(album.coverArt, 'album')}
                alt={album.name}
              />
              <PreviewCard.PlayButton onClick={onClickSpy} />
            </PreviewCard.ImageWrapper>
          </PreviewCard.Root>
        </Wrapper>,
      )

      cy.get('@onClickSpy').should('not.have.been.called')

      cy.getByTestId('card-image').wait(500).realHover()
      cy.getByTestId('card-play-button').click()

      cy.get('@onClickSpy').should('have.been.calledOnce')
    })
  })

  it('should display card title and subtitle', () => {
    cy.fixture('albums/album').then((album: SingleAlbum) => {
      cy.mount(
        <Wrapper>
          <PreviewCard.Root>
            <PreviewCard.ImageWrapper link="/test">
              <PreviewCard.Image
                src={getCoverArtUrl(album.coverArt, 'album')}
                alt={album.name}
              />
            </PreviewCard.ImageWrapper>
            <PreviewCard.InfoWrapper>
              <PreviewCard.Title link="/cy-test">
                {album.name}
              </PreviewCard.Title>
              <PreviewCard.Subtitle link="/cy-test-2">
                {album.artist}
              </PreviewCard.Subtitle>
            </PreviewCard.InfoWrapper>
          </PreviewCard.Root>
        </Wrapper>,
      )

      cy.getByTestId('card-title')
        .should('be.visible')
        .and('have.text', album.name)

      cy.getByTestId('card-title-link')
        .should('be.visible')
        .and('have.attr', 'href', '/cy-test')

      cy.getByTestId('card-subtitle')
        .should('be.visible')
        .and('have.text', album.artist)

      cy.getByTestId('card-subtitle-link')
        .should('be.visible')
        .and('have.attr', 'href', '/cy-test-2')
    })
  })
})
