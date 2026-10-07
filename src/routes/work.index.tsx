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
  return (
    <main id="main" className="page" ref={ref}>
      <h1 data-enter>Work</h1>
      <p className="lede" data-enter>
        Current work first, then the archive. Entries marked draft are
        placeholders.
      </p>
      <div className="grid">
        {list.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </main>
  )
}
