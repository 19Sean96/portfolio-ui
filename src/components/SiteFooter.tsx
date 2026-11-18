import { countFound } from '~/progress/catalog'
import { useProgress } from '~/progress/useProgress'

export function SiteFooter() {
  const { found } = useProgress()
  const count = countFound(found)
  return (
    <footer className="site-footer">
      <p>
        <span className="found-figure">{count.found}</span> of {count.total}{' '}
        found. Things you have found on this site, saved in this browser.
      </p>
      <a href="https://github.com/19Sean96" rel="me">
        GitHub
      </a>
    </footer>
  )
}
