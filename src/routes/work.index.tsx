import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { ProjectCard } from '~/components/ProjectCard'
import { allProjects } from '~/content'
import { useEntrance } from '~/motion/useEntrance'
import { scenes, useStageScene } from '~/stage/StageProvider'

export const Route = createFileRoute('/work/')({
  head: () => ({ meta: [{ title: 'Work · Sean Anthony' }] }),
  component: Work,
})

function Work() {
  const ref = useRef<HTMLElement>(null)
  useStageScene(scenes.quiet)
  useEntrance(ref)
  const list = allProjects()
  const current = list.filter((p) => p.status !== 'archived')
  const archive = list.filter((p) => p.status === 'archived')
  return (
    <main id="main" className="page" ref={ref}>
      <h1 data-enter>Work</h1>
      <p className="lede" data-enter>
        Current work first, then the archive.
      </p>
      <section aria-labelledby="current-head">
        <h2 id="current-head" data-enter>
          Current
        </h2>
        <div className="grid grid-feature">
          {current.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
      <section aria-labelledby="archive-head">
        <h2 id="archive-head" data-enter>
          Archive
        </h2>
        <div className="grid grid-archive">
          {archive.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
