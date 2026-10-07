/*
 * Site copy, parsed from bio.md beside this file. bio.md is a copy of
 * /mnt/project-files/content/bio.md in the project, whose editable draft is
 * the Claude Doc "Portfolio bio and role blurbs". To sync, copy the file over
 * and run the tests; the parser fails loudly if a section goes missing.
 *
 * Shape it expects: "## Hero" (one paragraph, first sentence is the line),
 * "## About" (paragraphs), "## Roles" with "### Org · Title · Years" heads.
 */
import source from './bio.md?raw'

export interface Role {
  org: string
  title?: string
  years?: string
  blurb: string
}

function sections(md: string): Map<string, string> {
  const out = new Map<string, string>()
  for (const part of md.split(/^## /m).slice(1)) {
    const newline = part.indexOf('\n')
    out.set(part.slice(0, newline).trim(), part.slice(newline + 1).trim())
  }
  return out
}

function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function need(map: Map<string, string>, key: string): string {
  const value = map.get(key)
  if (!value) throw new Error(`bio.md has no "## ${key}" section.`)
  return value
}

export function parseBio(md: string) {
  const s = sections(md)
  const heroText = paragraphs(need(s, 'Hero')).join(' ')
  const split = heroText.search(/(?<=\.)\s/)
  const roles: Role[] = need(s, 'Roles')
    .split(/^### /m)
    .slice(1)
    .map((block) => {
      const newline = block.indexOf('\n')
      const [org, title, years] = block
        .slice(0, newline === -1 ? undefined : newline)
        .split('·')
        .map((x) => x.trim())
      return {
        org: org!,
        title: title || undefined,
        years: years?.replace(/ to /, '–') || undefined,
        blurb: paragraphs(newline === -1 ? '' : block.slice(newline + 1)).join(
          ' ',
        ),
      }
    })
  return {
    hero: {
      line: split === -1 ? heroText : heroText.slice(0, split),
      aside: split === -1 ? '' : heroText.slice(split + 1),
    },
    about: paragraphs(need(s, 'About')),
    roles,
  }
}

const bio = parseBio(source)

/** The name in the header and titles. A guess from seananthony.io, unconfirmed. */
export const siteName = 'Sean Anthony'
export const hero = bio.hero
export const about = bio.about
export const roles = bio.roles
