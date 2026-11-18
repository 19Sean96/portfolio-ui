import { Link } from '@tanstack/react-router'
import type { LabEntry } from '~/lab/types'

export function LabCard({
  entry,
  level = 3,
}: {
  entry: LabEntry
  /** The heading level: 2 when the card sits right under the page h1. */
  level?: 2 | 3
}) {
  const Heading = level === 2 ? 'h2' : 'h3'
  return (
    <article className="card" data-enter>
      <Link to="/lab/$id" params={{ id: entry.id }} className="card-link">
        <img className="media" src={entry.still} alt="" loading="lazy" />
        <div className="card-text">
          <p className="meta">
            {entry.status === 'sketch' && (
              <span className="pill pill-draft">sketch</span>
            )}
            <span>{entry.tech.join(' · ')}</span>
          </p>
          <Heading className="card-title">{entry.title}</Heading>
          <p className="card-sub">{entry.summary}</p>
        </div>
      </Link>
    </article>
  )
}
