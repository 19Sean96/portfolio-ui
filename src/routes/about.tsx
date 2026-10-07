import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { about, roles } from '~/content/bio'
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
  return (
    <main id="main" className="page" ref={ref}>
      <h1 data-enter>About</h1>
      <div className="prose">
        {about.map((p) => (
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
              {r.unconfirmed && (
                <span className="pill pill-draft">unconfirmed</span>
              )}
            </h3>
            {r.years && <p className="meta">{r.years}</p>}
            <p>{r.blurb}</p>
          </li>
        ))}
      </ol>
    </main>
  )
}
