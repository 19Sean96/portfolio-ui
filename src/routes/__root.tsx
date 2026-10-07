/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { useEffect, type ReactNode } from 'react'
import { SiteHeader } from '~/components/SiteHeader'
import { progress } from '~/progress/store'
import { StageProvider } from '~/stage/StageProvider'
import css from '~/styles/global.css?url'
import tokens from '~/styles/tokens.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'color-scheme', content: 'dark' },
      { title: 'Sean Anthony' },
      {
        name: 'description',
        content: 'Healthcare software, and a lab for what the browser can do.',
      },
    ],
    links: [
      { rel: 'stylesheet', href: tokens },
      { rel: 'stylesheet', href: css },
    ],
    // Marks the page as scripted before first paint, so entrance styles
    // hide only what a script will reveal.
    scripts: [{ children: "document.documentElement.classList.add('js')" }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

function NotFound() {
  return (
    <main className="page">
      <h1>Nothing here</h1>
      <p>
        No page answers at this address. <Link to="/">Go home</Link>.
      </p>
    </main>
  )
}

const konami = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

function useKonami() {
  useEffect(() => {
    let at = 0
    const onKey = (e: KeyboardEvent) => {
      at = e.key === konami[at] ? at + 1 : e.key === konami[0] ? 1 : 0
      if (at === konami.length) {
        at = 0
        if (progress().discover('egg:konami'))
          document.documentElement.dataset.egg = 'konami'
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}

function RootDocument({ children }: { children: ReactNode }) {
  useKonami()
  return (
    // The head script adds the js class before React hydrates.
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <StageProvider>
          <SiteHeader />
          {children}
        </StageProvider>
        <Scripts />
      </body>
    </html>
  )
}
