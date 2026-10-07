import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    // Route changes cross-fade through the View Transitions API where the
    // browser has it; the stage fades its own scene on the shared clock.
    defaultViewTransition: true,
  })
}
