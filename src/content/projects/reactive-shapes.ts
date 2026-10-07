import type { Project } from '../schema'

export const reactiveShapes: Project = {
  slug: 'reactive-shapes',
  title: 'Reactive Shapes',
  subtitle: 'Animated memory game',
  summary:
    'A memory game of random colors and shapes in React with SVG animation. Click a shape twice and the game is over.',
  body: [
    'A memory game of randomized colors and shapes. Click a shape you already clicked and the game ends.',
    'Built in React, with SVG polygon animation for fast, smooth transitions.',
  ],
  role: ['junior developer'],
  years: '2019',
  status: 'archived',
  tech: ['React', 'SCSS', 'SVG'],
  links: [
    { label: 'Site', href: 'https://reactiveshapes.netlify.app' },
    { label: 'Repo', href: 'https://github.com/19Sean96/memoryGame' },
  ],
  media: {
    kind: 'video',
    sources: [
      '/media/work/reactive-shapes.webm',
      '/media/work/reactive-shapes.mp4',
    ],
    alt: 'Reactive Shapes gameplay',
  },
  feature: 0,
}
