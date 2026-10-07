import type { Project } from '../schema'

export const brownSales: Project = {
  slug: 'brown-sales',
  title: 'Brown Sales',
  subtitle: 'Clearance catalog for a client',
  summary:
    'A clearance catalog where customers browse products before ordering in store, with Contentful so the client manages stock themselves.',
  body: [
    'Brown Sales wanted a site where customers can view clearance products before heading to the store to order.',
    'The client needed to add and remove products on their own, so Contentful served as the headless CMS.',
  ],
  role: ['lead developer', 'junior designer'],
  years: '2020',
  status: 'archived',
  tech: ['React', 'Contentful', 'Netlify'],
  links: [
    { label: 'Site', href: 'https://brown-sales.netlify.app' },
    {
      label: 'Repo',
      href: 'https://github.com/19Sean96/brownsales/tree/stable',
    },
  ],
  media: {
    kind: 'video',
    sources: ['/media/work/brownsales.webm', '/media/work/brownsales.mp4'],
    alt: 'Brown Sales site walkthrough',
  },
  feature: 0,
}
