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
Cypress.Commands.add('getByTestId', (query) => {
  return cy.get(`[data-testid="${query}"]`)
})

Cypress.Commands.add('mockCoverArt', () => {
  cy.intercept('/rest/getCoverArt**', { fixture: 'coverArt.jpeg' })
})
