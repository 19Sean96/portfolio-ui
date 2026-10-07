import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { LabCard } from '~/components/LabCard'
import { labExperiments } from '~/lab/registry'
import { useEntrance } from '~/motion/useEntrance'
import { scenes, useStageScene } from '~/stage/StageProvider'

export const Route = createFileRoute('/lab/')({
  head: () => ({ meta: [{ title: 'Lab · Sean Anthony' }] }),
  component: Lab,
})

function Lab() {
  const ref = useRef<HTMLElement>(null)
  useStageScene(scenes.quiet)
  useEntrance(ref)
  return (
    <main id="main" className="page" ref={ref}>
      <h1 data-enter>Lab</h1>
      <p className="lede" data-enter>
        Small experiments with browser features. Each one checks what your
        browser can do and shows a still when it cannot run.
      </p>
      <div className="grid">
        {labExperiments.map((e) => (
          <LabCard key={e.id} entry={e} />
        ))}
      </div>
    </main>
  )
}
