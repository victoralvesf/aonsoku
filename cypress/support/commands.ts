/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
import i18n from '@/i18n'

Cypress.Commands.add('getByTestId', (query) => {
  return cy.get(`[data-testid="${query}"]`)
})

Cypress.Commands.add('mockCoverArt', () => {
  cy.intercept('/rest/getCoverArt**', { fixture: 'coverArt.jpeg' })
})

Cypress.Commands.add('changeLang', (lang) => {
  i18n.changeLanguage(lang)
})

Cypress.Commands.add(
  'findByTestId',
  { prevSubject: true },
  (subject, testId) => {
    return cy.wrap(subject).find(`[data-testid="${testId}"]`)
  },
)
