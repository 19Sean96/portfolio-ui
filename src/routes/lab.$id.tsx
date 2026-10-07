import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'
import {
  browserCapabilities,
  capabilityWords,
  missing,
} from '~/lab/capabilities'
import { labEntry } from '~/lab/registry'
import { clock } from '~/motion/clock'
import { useEntrance } from '~/motion/useEntrance'
import { progress } from '~/progress/store'
import { scenes, useStage } from '~/stage/StageProvider'

export const Route = createFileRoute('/lab/$id')({
  loader: ({ params }) => {
    const entry = labEntry(params.id)
    if (!entry) throw notFound()
    return { id: entry.id, title: entry.title, summary: entry.summary }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Lab · Sean Anthony` },
          { name: 'description', content: loaderData.summary },
        ]
      : [],
  }),
  component: Experiment,
})

type Run = 'loading' | 'running' | 'failed'

const noSubscribe = () => () => {}

function list(words: string[]) {
  return words.length < 2
    ? words.join('')
    : `${words.slice(0, -1).join(', ')} and ${words.at(-1)}`
}

function Experiment() {
  const { id } = Route.useLoaderData()
  const entry = labEntry(id)!
  const stage = useStage()
  const page = useRef<HTMLElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const [run, setRun] = useState<Run>('loading')
  // Null on the server and during hydration; the browser's answer after.
  const caps = useSyncExternalStore(
    noSubscribe,
    browserCapabilities,
    () => null,
  )
  const lacks = caps ? missing(entry.requires, caps) : null
  useEntrance(page, id)

  useEffect(() => {
    if (!caps) return
    if (missing(entry.requires, caps).length > 0) {
      void stage.show(scenes.quiet)
      return
    }
    let dispose: (() => void) | null = null
    let cancelled = false
    entry.load().then(
      ({ default: lab }) => {
        if (cancelled || !host.current) return
        dispose = lab.mount(host.current, {
          clock: clock(),
          caps,
          showScene: (loader) => stage.show(loader),
          discover: (found) => void progress().discover(found),
        })
        progress().discover(`lab:${entry.id}`)
        setRun('running')
      },
      () => !cancelled && setRun('failed'),
    )
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [entry, stage, caps])

  return (
    <main id="main" className="page lab-page" ref={page}>
      <p className="crumbs" data-enter>
        <Link to="/lab">Lab</Link>
      </p>
      <h1 data-enter>{entry.title}</h1>
      <p className="lede" data-enter>
        {entry.summary}
      </p>
      {lacks && lacks.length > 0 && (
        <figure className="lab-still" data-enter>
          <img src={entry.still} alt={`A still of ${entry.title}`} />
          <figcaption>
            This piece needs {list(lacks.map((c) => capabilityWords[c]))}, which
            this browser does not offer. Here is a still.
          </figcaption>
        </figure>
      )}
      {run === 'failed' && (
        <p role="alert">The experiment did not load. Reload to try again.</p>
      )}
      <div ref={host} className="lab-host" data-enter />
    </main>
  )
}
