import { Link } from '@tanstack/react-router'
import type { Project } from '~/content'
import { Media } from './Media'

export const statusWords: Record<Project['status'], string> = {
  live: 'live',
  shipped: 'shipped',
  archived: 'archive',
  planned: 'planned',
}

export function ProjectCard({ project }: { project: Project }) {
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
          <p className="meta">
            <span className={`pill pill-${project.status}`}>
              {statusWords[project.status]}
            </span>
            {project.placeholder && (
              <span className="pill pill-draft">draft</span>
            )}
            <span>{project.years}</span>
          </p>
          <h3>{project.title}</h3>
          <p className="card-sub">{project.subtitle}</p>
        </div>
      </Link>
    </article>
  )
}
