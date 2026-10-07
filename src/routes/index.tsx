import { Link, createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { LabCard } from '~/components/LabCard'
import { ProjectCard } from '~/components/ProjectCard'
import { featuredProjects } from '~/content'
import { hero } from '~/content/bio'
import { labExperiments } from '~/lab/registry'
import { useEntrance } from '~/motion/useEntrance'
import { scenes, useStageScene } from '~/stage/StageProvider'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const ref = useRef<HTMLElement>(null)
  useStageScene(scenes.drift)
  useEntrance(ref)
  return (
    <main id="main" className="page" ref={ref}>
      <section className="hero">
        <h1 data-enter>{hero.line}</h1>
        <p className="lede" data-enter>
          {hero.aside}
        </p>
      </section>

      <section aria-labelledby="work-head">
        <div className="section-head" data-enter>
          <h2 id="work-head">Work</h2>
          <Link to="/work">All work</Link>
        </div>
        <div className="grid">
          {featuredProjects().map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <section aria-labelledby="lab-head">
        <div className="section-head" data-enter>
          <h2 id="lab-head">Lab</h2>
          <Link to="/lab">All experiments</Link>
        </div>
        <div className="grid">
          {labExperiments.map((e) => (
            <LabCard key={e.id} entry={e} />
          ))}
        </div>
      </section>
    </main>
  )
}
