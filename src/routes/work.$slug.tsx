import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { useRef } from 'react'
import { FlowDiagram } from '~/components/FlowDiagram'
import { Media } from '~/components/Media'
import { statusWords } from '~/components/ProjectCard'
import { projectBySlug } from '~/content'
import { labEntry } from '~/lab/registry'
import { useEntrance } from '~/motion/useEntrance'
import { useDiscover } from '~/progress/useProgress'
import { scenes, useStageScene } from '~/stage/StageProvider'

export const Route = createFileRoute('/work/$slug')({
  loader: ({ params }) => {
    const project = projectBySlug(params.slug)
    if (!project) throw notFound()
    return project
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} · Sean Anthony` },
          { name: 'description', content: loaderData.summary },
        ]
      : [],
  }),
  component: ProjectPage,
})

function ProjectPage() {
  const project = Route.useLoaderData()
  const ref = useRef<HTMLElement>(null)
  useStageScene(scenes.quiet)
  useEntrance(ref, project.slug)
  useDiscover(project.placeholder ? null : `work:${project.slug}`)
  const experiment = project.experiment
    ? labEntry(project.experiment)
    : undefined

  return (
    <main id="main" className="page project" ref={ref}>
      <p className="crumbs" data-enter>
        <Link to="/work">Work</Link>
      </p>
      <h1 data-enter>{project.title}</h1>
      <p className="lede" data-enter>
        {project.subtitle}
      </p>
      <dl className="facts" data-enter>
        <div>
          <dt>Role</dt>
          <dd>{project.role.join(', ')}</dd>
        </div>
        <div>
          <dt>Years</dt>
          <dd>{project.years}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{statusWords[project.status]}</dd>
        </div>
        {project.tech.length > 0 && (
          <div>
            <dt>Built with</dt>
            <dd>{project.tech.join(', ')}</dd>
          </div>
        )}
      </dl>

      <div className="project-media" data-enter>
        <Media
          media={project.media}
          seed={project.slug}
          label={project.title}
        />
      </div>

      <div className="prose">
        {project.body.map((block, i) =>
          typeof block === 'string' ? (
            <p key={i} data-enter>
              {block}
            </p>
          ) : (
            <FlowDiagram key={i} block={block} />
          ),
        )}
      </div>

      {project.pieces && (
        <section aria-labelledby="pieces-head" className="pieces">
          <h2 id="pieces-head" data-enter>
            Pieces
          </h2>
          <ol>
            {project.pieces.map((piece) => (
              <li key={piece.name} data-enter data-status={piece.status}>
                {piece.href ? (
                  <a href={piece.href} target="_blank" rel="noreferrer">
                    {piece.name}
                  </a>
                ) : (
                  <span>{piece.name}</span>
                )}
                {piece.status === 'in-progress' && (
                  <span className="pill pill-draft">in progress</span>
                )}
                <p>{piece.line}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {(project.links.length > 0 || experiment) && (
        <ul className="links" data-enter>
          {project.links.map((link) => (
            <li key={link.href}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
              {link.dead && (
                <span className="pill pill-archived">may be offline</span>
              )}
            </li>
          ))}
          {experiment && (
            <li>
              <Link to="/lab/$id" params={{ id: experiment.id }}>
                Lab: {experiment.title}
              </Link>
            </li>
          )}
        </ul>
      )}
    </main>
  )
}
