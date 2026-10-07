import { describe, expect, it } from 'vitest'
import { allProjects, featuredProjects, projectBySlug, projects } from '.'
import { labExperiments } from '~/lab/registry'
import { validateProject } from './schema'

describe('content', () => {
  it('every project passes the schema', () => {
    expect(projects.flatMap(validateProject)).toEqual([])
  })

  it('slugs are unique', () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('an experiment id names a lab entry', () => {
    const ids = new Set(labExperiments.map((e) => e.id))
    for (const p of projects)
      if (p.experiment) expect(ids).toContain(p.experiment)
  })

  it('sorts live work first and features by weight', () => {
    expect(allProjects()[0]?.status).toBe('live')
    expect(featuredProjects()[0]?.slug).toBe('berine-metabolic')
    expect(projectBySlug('picki')?.title).toBe('Picki')
  })
})
