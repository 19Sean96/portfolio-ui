import type { Project } from '../schema'

export const picki: Project = {
  slug: 'picki',
  title: 'Picki',
  subtitle: 'Restaurant locator',
  summary:
    'A restaurant locator on the Yelp API where reviews are emoji and you swipe between restaurants on mobile.',
  body: [
    'A restaurant locator and review platform that lets people tag reviews with emoji, with data from the Yelp API.',
    'A school project, and my first use of touch controls: swipe between restaurants on mobile.',
  ],
  role: ['junior developer'],
  years: '2019',
  status: 'archived',
  tech: ['Express', 'Handlebars', 'MySQL', 'Yelp API', 'Heroku'],
  links: [
    { label: 'Site', href: 'https://picki-food.herokuapp.com/', dead: true },
    { label: 'Repo', href: 'https://github.com/19Sean96/Project-2' },
  ],
  media: {
    kind: 'video',
    sources: ['/media/work/picki.webm', '/media/work/picki.mp4'],
    alt: 'Picki app walkthrough',
  },
  feature: 0,
}
