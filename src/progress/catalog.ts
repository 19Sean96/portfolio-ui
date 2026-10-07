/*
 * Everything a visitor can find, so the badge can say "4 of 15". Lab pieces
 * may record extra ids of their own; those count as found but are not in
 * the total until they are listed here.
 */
import { projects } from '~/content'
import { labExperiments } from '~/lab/registry'

export const eggs = ['egg:konami'] as const

export function discoverables(): string[] {
  return [
    ...projects.filter((p) => !p.placeholder).map((p) => `work:${p.slug}`),
    ...labExperiments.map((e) => `lab:${e.id}`),
    'audio-field:mic',
    'gradient-field:max-warp',
    ...eggs,
  ]
}

export function countFound(found: Record<string, number>): {
  found: number
  total: number
} {
  const all = discoverables()
  return { found: all.filter((id) => id in found).length, total: all.length }
}
