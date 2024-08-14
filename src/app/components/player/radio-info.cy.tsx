import { ReactNode } from 'react'
import { Radio } from '@/types/responses/radios'
import { RadioInfo } from './radio-info'

function Wrapper({ children }: { children: ReactNode }) {
  return <div className="flex items-center gap-2 w-full">{children}</div>
}

describe('RadioInfo Component', () => {
  beforeEach(() => {
    cy.viewport('macbook-11')
  })

  describe('English', () => {
    beforeEach(() => {
      cy.changeLang('en-US')
    })

    it('should display radio info with label', () => {
      cy.fixture('radios/stations').then((radios: Radio[]) => {
        const radio = radios[0]

        cy.mount(
          <Wrapper>
            <RadioInfo radio={radio} />
          </Wrapper>,
        )

        cy.getByTestId('radio-icon')
          .should('be.visible')
          .and('have.class', 'lucide-radio')

        cy.getByTestId('radio-name')
          .should('be.visible')
          .and('have.text', radio.name)

        cy.getByTestId('radio-label')
          .should('be.visible')
          .and('have.text', 'Radio')
      })
    })

    it('should display a message if no radio is playing', () => {
      cy.mount(
        <Wrapper>
          <RadioInfo radio={undefined} />
        </Wrapper>,
      )

      cy.getByTestId('radio-icon')
        .should('be.visible')
        .and('have.class', 'lucide-radio')

      cy.getByTestId('radio-no-playing')
        .should('be.visible')
        .and('have.text', 'No radio playing')
    })
  })

  describe('Portuguese', () => {
    beforeEach(() => {
      cy.changeLang('pt-BR')
    })

    it('should display radio info with label', () => {
      cy.fixture('radios/stations').then((radios: Radio[]) => {
        const radio = radios[5]

        cy.mount(
          <Wrapper>
            <RadioInfo radio={radio} />
          </Wrapper>,
        )

        cy.getByTestId('radio-icon')
          .should('be.visible')
          .and('have.class', 'lucide-radio')

        cy.getByTestId('radio-name')
          .should('be.visible')
          .and('have.text', radio.name)

        cy.getByTestId('radio-label')
          .should('be.visible')
          .and('have.text', 'Rádio')
      })
    })

    it('should display a message if no radio is playing', () => {
      cy.mount(
        <Wrapper>
          <RadioInfo radio={undefined} />
        </Wrapper>,
      )

      cy.getByTestId('radio-icon')
        .should('be.visible')
        .and('have.class', 'lucide-radio')

      cy.getByTestId('radio-no-playing')
        .should('be.visible')
        .and('have.text', 'Nenhum rádio tocando')
    })
  })
})
