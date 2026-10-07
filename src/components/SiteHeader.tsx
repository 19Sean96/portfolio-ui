import { Link } from '@tanstack/react-router'
import { siteName } from '~/content/bio'
import { countFound } from '~/progress/catalog'
import { useProgress } from '~/progress/useProgress'

const nav = [
  { to: '/work', words: 'Work' },
  { to: '/lab', words: 'Lab' },
  { to: '/about', words: 'About' },
] as const

export function SiteHeader() {
  const { found } = useProgress()
  const count = countFound(found)
  return (
    <header className="site-header">
      <Link to="/" className="wordmark">
        {siteName}
      </Link>
      <nav aria-label="Main">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="nav-link"
            activeProps={{ 'aria-current': 'page' }}
          >
            {item.words}
          </Link>
        ))}
      </nav>
      <p
        className="found"
        title="Things you have found on this site, saved in this browser"
      >
        <span className="found-figure">{count.found}</span> of {count.total}{' '}
        found
      </p>
    </header>
  )
}
