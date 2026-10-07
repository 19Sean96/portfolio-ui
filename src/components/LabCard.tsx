import { Link } from '@tanstack/react-router'
import type { LabEntry } from '~/lab/types'

export function LabCard({ entry }: { entry: LabEntry }) {
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
          <h3>{entry.title}</h3>
          <p className="card-sub">{entry.summary}</p>
        </div>
      </Link>
    </article>
  )
}
