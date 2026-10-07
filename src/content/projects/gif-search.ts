import type { Project } from '../schema'

export const gifSearch: Project = {
  slug: 'gif-search',
  title: 'GIF Search',
  subtitle: 'Giphy API engine',
  summary:
    'A front-end Giphy search with controls for rating and result count. My first project that managed an API with axios.',
  body: [
    'A complete front-end application and my first project using axios to manage an API.',
    'The Giphy queries let you change the rating (G to R) and how many GIFs come back.',
  ],
  role: ['junior developer'],
  years: '2019',
  status: 'archived',
  tech: ['jQuery', 'SCSS', 'HTML', 'GitHub Pages'],
  links: [
    { label: 'Site', href: 'https://19sean96.github.io/gif-generator-MAX/' },
    { label: 'Repo', href: 'https://github.com/19Sean96/gif-generator-MAX' },
  ],
  media: {
    kind: 'video',
    sources: ['/media/work/giphy.webm', '/media/work/giphy.mp4'],
    alt: 'GIF Search walkthrough',
  },
  feature: 0,
}
