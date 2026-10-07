import { describe, expect, it } from 'vitest'
import { missing, noCapabilities } from './capabilities'
import { labEntry, labExperiments } from './registry'

describe('lab registry', () => {
  it('ids are unique and kebab-case', () => {
    const ids = labExperiments.map((e) => e.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
  })

  it('every entry has a still under /lab/', () => {
    for (const e of labExperiments)
      expect(e.still).toMatch(/^\/lab\/.+\.(svg|jpg|png|webp)$/)
  })

  it('reports what a browser lacks', () => {
    const entry = labEntry('audio-field')!
    expect(missing(entry.requires, noCapabilities)).toEqual(['webgl2', 'audio'])
    expect(
      missing(entry.requires, { ...noCapabilities, webgl2: true, audio: true }),
    ).toEqual([])
  })
})
