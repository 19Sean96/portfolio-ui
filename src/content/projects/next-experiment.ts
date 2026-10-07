import type { Project } from '../schema'

export const nextExperiment: Project = {
  slug: 'next-experiment',
  title: 'Next experiment',
  subtitle: 'Planned',
  summary:
    'A slot for the next project. Replace this entry when it has a name.',
  body: ['Placeholder entry so the planned state has something to render.'],
  role: ['tbd'],
  years: '2026',
  status: 'planned',
  tech: [],
  links: [],
  media: { kind: 'none' },
  feature: 0,
  placeholder: true,
}
