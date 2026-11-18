import { Link } from '@tanstack/react-router'
import type { Project } from '~/content'
import { Media } from './Media'

export const statusWords: Record<Project['status'], string> = {
  live: 'live',
  shipped: 'shipped',
  archived: 'archive',
  planned: 'planned',
}

export function ProjectCard({
  project,
  level = 3,
}: {
  project: Project
  /** The heading level: 2 when the card sits right under the page h1. */
  level?: 2 | 3
}) {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <article className="card" data-enter>
      <Link
        to="/work/$slug"
        params={{ slug: project.slug }}
        className="card-link"
      >
        <Media
          media={project.media}
          seed={project.slug}
          label={project.title}
        />
        <div className="card-text">
          <Heading className="card-title">{project.title}</Heading>
          <p className="card-sub">{project.subtitle}</p>
          <p className="meta">
            <span className={`pill pill-${project.status}`}>
              {statusWords[project.status]}
            </span>
            {project.placeholder && (
              <span className="pill pill-draft">draft</span>
            )}
            <span>{project.years}</span>
          </p>
        </div>
      </Link>
    </article>
  )
}
