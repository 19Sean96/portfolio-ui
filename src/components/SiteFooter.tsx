import { contactEmail, githubUrl } from '~/content/bio'
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
      <p className="footer-links">
        <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
        <a href={githubUrl} rel="me">
          GitHub
        </a>
      </p>
    </footer>
  )
}
