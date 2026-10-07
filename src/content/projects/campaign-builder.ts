import type { Project } from '../schema'

export const campaignBuilder: Project = {
  slug: 'campaign-builder',
  title: 'Campaign Builder',
  subtitle: 'E-commerce marketing template',
  summary:
    'A two-part campaign template: each campaign lives at domain.com/<campaign> with its own products, branding media and theme color.',
  body: [
    'A dynamic campaign template for marketing products, built with React and Express, with Directus managing the database and hosting the API.',
    'The campaign creator adds products across categories, branding media and a theme color, and each campaign is served at its own path.',
  ],
  role: ['lead developer', 'junior designer'],
  years: '2020',
  status: 'archived',
  tech: ['React', 'Express', 'Directus', 'SQL', 'Ubuntu + PM2'],
  links: [
    {
      label: 'Site',
      href: 'https://campaign.sportexsafety.com/covid',
      dead: true,
    },
    {
      label: 'Repo',
      href: 'https://github.com/19Sean96/express-react-campaign-template',
    },
  ],
  media: {
    kind: 'video',
    sources: [
      '/media/work/campaign-builder.webm',
      '/media/work/campaign-builder.mp4',
    ],
    alt: 'Campaign Builder app walkthrough',
  },
  feature: 0,
}
