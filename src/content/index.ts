/*
 * The content index. Add a project by writing a file under projects/ and
 * listing it here; the order below does not matter, the readers sort.
 */
import { avSeries } from './projects/av-series'
import { berineMetabolic } from './projects/berine-metabolic'
import { brownSales } from './projects/brown-sales'
import { campaignBuilder } from './projects/campaign-builder'
import { gifSearch } from './projects/gif-search'
import { integralife } from './projects/integralife'
import { nextExperiment } from './projects/next-experiment'
import { picki } from './projects/picki'
import { reactiveShapes } from './projects/reactive-shapes'
import type { Project, ProjectStatus } from './schema'

export type { Project, ProjectMedia, ProjectStatus } from './schema'

export const projects: readonly Project[] = [
  berineMetabolic,
  avSeries,
  integralife,
  campaignBuilder,
  brownSales,
  picki,
  gifSearch,
  reactiveShapes,
  nextExperiment,
]

const statusOrder: Record<ProjectStatus, number> = {
  live: 0,
  shipped: 1,
  planned: 2,
  archived: 3,
}

function firstYear(p: Project): number {
  return Number.parseInt(p.years, 10) || 0
}

/** Live work first, then newest first inside each status. */
export function allProjects(): Project[] {
  return [...projects].sort(
    (a, b) =>
      statusOrder[a.status] - statusOrder[b.status] ||
      firstYear(b) - firstYear(a) ||
      a.title.localeCompare(b.title),
  )
}

export function featuredProjects(limit = 3): Project[] {
  return projects
    .filter((p) => p.feature > 0)
    .sort((a, b) => b.feature - a.feature)
    .slice(0, limit)
}

export function projectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}
