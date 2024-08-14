import { MountOptions, MountReturn } from 'cypress/react18'
import { MemoryRouterProps } from 'react-router-dom'

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Mounts a React node
       * @param component React Node to mount
       * @param options Additional options to pass into mount
       */
      mount(
        component: React.ReactNode,
        options?: MountOptions & { routerProps?: MemoryRouterProps },
      ): Chainable<MountReturn>
      /**
       * Custom command to select DOM element by data-testid attribute.
       * @example cy.getByTestId('greeting')
       */
      getByTestId(value: string): Chainable<JQuery<HTMLElement>>
      /**
       * Custom command to mock cover art image.
       * @example cy.mockCoverArt()
       */
      mockCoverArt(): Chainable<void>
      /**
       * Custom command to change applications language.
       * @example cy.changeLang()
       */
      changeLang(lang: 'en-US' | 'pt-BR'): Chainable<void>
    }
  }
}
