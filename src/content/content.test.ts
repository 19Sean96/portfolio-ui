import { describe, expect, it } from 'vitest'
import { allProjects, featuredProjects, projectBySlug, projects } from '.'
import { labExperiments } from '~/lab/registry'
import { validateProject } from './schema'

describe('content', () => {
  it('every project passes the schema', () => {
    expect(projects.flatMap(validateProject)).toEqual([])
  })

  it('an in-progress piece carries no source link', () => {
    const avSeries = projectBySlug('av-series')!
    const pieces = avSeries.pieces!.map((piece) =>
      piece.status === 'in-progress'
        ? { ...piece, source: 'https://example.com/code' }
        : piece,
    )
    expect(validateProject({ ...avSeries, pieces })).not.toEqual([])
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

describe('bio', () => {
  it('parses every section of bio.md', async () => {
    const { hero, about, roles } = await import('./bio')
    expect(hero.line).toMatch(/\.$/)
    expect(hero.aside.length).toBeGreaterThan(0)
    expect(about.length).toBeGreaterThan(1)
    expect(roles.length).toBeGreaterThan(3)
    for (const r of roles) expect(r.blurb.length).toBeGreaterThan(20)
  })
})
