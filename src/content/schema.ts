/*
 * The project schema. Every entry under content/projects/ is one of these,
 * checked at build time by the type and at test time by validateProject, so a
 * missing field fails the build instead of rendering a hole.
 *
 * Placeholder entries are allowed and say so (`placeholder: true`); the work
 * index shows them with a "draft" mark until real copy lands.
 */

export const projectStatuses = [
  'live',
  'shipped',
  'archived',
  'planned',
] as const
export type ProjectStatus = (typeof projectStatuses)[number]

export type ProjectMedia =
  | { kind: 'video'; sources: string[]; poster?: string; alt: string }
  | { kind: 'image'; src: string; alt: string }
  /** No capture yet: the card draws a generated still from the slug. */
  | { kind: 'none' }

/**
 * One piece of a series (the AV pieces, later lab spin-offs). Only built
 * pieces carry a link; an in-progress piece holds its slot with a name and a
 * line, and becomes a full card when it ships.
 */
export interface ProjectPiece {
  name: string
  line: string
  status: 'built' | 'in-progress'
  href?: string
  still?: string
}

/**
 * An animated flow diagram: how a thing is built, drawn as boxes and arrows
 * that play in on the shared timeline when scrolled into view. Case studies
 * use these in place of screenshots of private work.
 */
export interface FlowNode {
  id: string
  label: string
  detail?: string
  /** Grid placement: column left to right, row top to bottom. */
  col: number
  row: number
  /** Who acts at this step, e.g. "person", "agent", "system". */
  actor?: 'person' | 'agent' | 'system'
}

export interface FlowBlock {
  kind: 'flow'
  title: string
  caption?: string
  nodes: FlowNode[]
  edges: [from: string, to: string, label?: string][]
}

/** A string is a paragraph; anything richer is a typed block. */
export type ProjectBlock = string | FlowBlock

export interface ProjectLink {
  label: string
  href: string
  /** Old hosts (Heroku free dynos and so on) are kept but marked. */
  dead?: boolean
}

export interface Project {
  slug: string
  title: string
  subtitle: string
  /** One or two sentences for cards and meta descriptions. */
  summary: string
  /** The project page, in order: paragraphs and diagram blocks. */
  body: ProjectBlock[]
  role: string[]
  /** A single year or a span, e.g. "2019" or "2024–2026". */
  years: string
  status: ProjectStatus
  tech: string[]
  links: ProjectLink[]
  media: ProjectMedia
  /** Higher sorts first on the home page; 0 means not featured. */
  feature: number
  pieces?: ProjectPiece[]
  /** A lab experiment id that belongs to this project. */
  experiment?: string
  placeholder?: boolean
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/** Returns the problems with one entry; an empty list means it is good. */
export function validateProject(p: Project): string[] {
  const problems: string[] = []
  if (!slugPattern.test(p.slug))
    problems.push(`slug "${p.slug}" is not kebab-case`)
  for (const key of ['title', 'subtitle', 'summary', 'years'] as const) {
    if (!p[key].trim()) problems.push(`${p.slug}: ${key} is empty`)
  }
  if (p.body.length === 0) problems.push(`${p.slug}: body has no paragraphs`)
  if (p.role.length === 0) problems.push(`${p.slug}: role is empty`)
  if (!projectStatuses.includes(p.status))
    problems.push(`${p.slug}: unknown status`)
  for (const link of p.links) {
    if (!/^https?:\/\//.test(link.href))
      problems.push(`${p.slug}: link "${link.label}" is not absolute`)
  }
  for (const block of p.body) {
    if (typeof block === 'string') continue
    const ids = new Set(block.nodes.map((n) => n.id))
    if (ids.size !== block.nodes.length)
      problems.push(`${p.slug}: flow "${block.title}" repeats a node id`)
    for (const [from, to] of block.edges) {
      if (!ids.has(from) || !ids.has(to))
        problems.push(
          `${p.slug}: flow "${block.title}" edge ${from}→${to} names a missing node`,
        )
    }
  }
  if (p.media.kind === 'video' && p.media.sources.length === 0)
    problems.push(`${p.slug}: video media has no sources`)
  for (const piece of p.pieces ?? []) {
    if (piece.status === 'built' && !piece.href)
      problems.push(`${p.slug}: built piece "${piece.name}" has no link`)
    if (piece.status === 'in-progress' && piece.href)
      problems.push(
        `${p.slug}: in-progress piece "${piece.name}" must not link`,
      )
  }
  return problems
}
