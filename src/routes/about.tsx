import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { about, contactEmail, githubUrl, roles } from '~/content/bio'
import { useEntrance } from '~/motion/useEntrance'
import { scenes, useStageScene } from '~/stage/StageProvider'

export const Route = createFileRoute('/about')({
  head: () => ({ meta: [{ title: 'About · Sean Anthony' }] }),
  component: About,
})

function About() {
  const ref = useRef<HTMLElement>(null)
  useStageScene(scenes.quiet)
  useEntrance(ref)
  // The first paragraph opens the page as its lede, like every other page.
  const [lede, ...rest] = about
  return (
    <main id="main" className="page" ref={ref}>
      <h1 data-enter>About</h1>
      {lede && (
        <p className="lede" data-enter>
          {lede}
        </p>
      )}
      <div className="prose">
        {rest.map((p) => (
          <p key={p} data-enter>
            {p}
          </p>
        ))}
      </div>
      <h2 data-enter>Roles</h2>
      <ol className="roles">
        {roles.map((r) => (
          <li key={r.org} data-enter>
            <h3>
              {r.org}
              {r.title && <span className="role-title"> · {r.title}</span>}
            </h3>
            {r.years && <p className="meta">{r.years}</p>}
            <p>{r.blurb}</p>
          </li>
        ))}
      </ol>
      <h2 data-enter>Contact</h2>
      <ul className="links" data-enter>
        <li>
          <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        </li>
        <li>
          <a href={githubUrl} rel="me">
            GitHub
          </a>
        </li>
      </ul>
    </main>
  )
}
