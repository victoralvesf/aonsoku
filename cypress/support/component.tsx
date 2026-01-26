/* eslint-disable @typescript-eslint/no-namespace */

// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mount } from 'cypress/react'
import type { MountOptions, MountReturn } from 'cypress/react'
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom'
import { useAppStore } from '@/store/app.store'
import { AuthType } from '@/types/serverConfig'
import 'cypress-real-events'
import '@/index.css'
import '@/themes.css'
import '@/fonts.css'
import '@/i18n'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount(
        component: React.ReactNode,
        options?: MountOptions & { routerProps?: MemoryRouterProps }
      ): Cypress.Chainable<MountReturn>
    }
  }
}

const queryClient = new QueryClient()

useAppStore.setState((state) => ({
  ...state,
  data: {
    // fix cy.intercept that wasn't intercepting requests without a base URL
    url: 'http://localhost:5173',
    // set a default authType to avoid errors
    authType: AuthType.TOKEN,
  },
}))

Cypress.Commands.add('mount', (component, options: MountOptions & { routerProps?: MemoryRouterProps } = {}) => {
  const { routerProps = { initialEntries: ['/'] }, ...mountOptions } = options

  const wrapped = (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...routerProps}>{component}</MemoryRouter>
    </QueryClientProvider>
  )

  return mount(wrapped, mountOptions)
})
