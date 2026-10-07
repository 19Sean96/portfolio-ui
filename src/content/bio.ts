/*
 * Site copy. Source: /mnt/project-files/content/bio.md in the project, whose
 * editable draft is the Claude Doc "Portfolio bio and role blurbs" (the doc
 * wins on conflict). Titles marked unconfirmed wait on Sean.
 */

export const hero = {
  name: 'Sean Anthony',
  line: 'I build healthcare software people can actually use.',
  aside: 'This site is where I find out what the browser can do.',
}

export const about: string[] = [
  'I build healthcare software that patients and clinicians can actually use.',
  'My path ran through client service in banking, then web development and UI design, then healthcare. In 2024 I co-founded Integralife, a diabetes and nutrition clinic that grew from one Tempe office to care across most of the United States. Myor Care acquired it in May 2026.',
  "Today I lead engineering at Berine Metabolic, where we're building an online course for adults with type 2 diabetes and the platform behind it.",
  'This site is my lab. Shaders, Web Audio, motion and small games sit next to the client work, because the experiments are where I learn the tools I ship with.',
]

export interface Role {
  org: string
  title?: string
  years?: string
  blurb: string
  unconfirmed?: boolean
}

export const roles: Role[] = [
  {
    org: 'Berine Metabolic',
    title: 'Co-Founder, Head Engineer',
    blurb:
      'Berine Metabolic makes clinical diabetes education available to anyone, starting with an online course for adults with type 2 diabetes. Leads product and engineering across the full platform, from the website and course app to payments and a pipeline that produces 120+ lesson videos.',
  },
  {
    org: 'Integralife',
    title: 'Director of Technology',
    years: '2024–2026',
    blurb:
      'Integralife was a diabetes and nutrition clinic that grew from one Tempe office to telehealth care across most of the United States. Built and ran its technology and operations through that growth and its acquisition by Myor Care in May 2026.',
  },
  {
    org: 'San Carlos Apache Healthcare Corporation',
    title: 'Design Engineer',
    blurb:
      'San Carlos Apache Healthcare Corporation is a tribally run health system serving the San Carlos Apache community. Designed and built digital tools that made care information easier for patients and staff to find and use.',
  },
  {
    org: 'Unwired Revolution',
    blurb:
      'Unwired Revolution builds enterprise mobility and field-service software, including the RemoteLink platform. Built and ran the marketing websites for its products, working between marketing and core development to turn product interest into qualified leads.',
  },
  {
    org: 'THINKPro',
    title: 'Lead Web Developer, UI Designer',
    blurb:
      'THINKPro Graphic and Printing Solutions is a Tempe print and design shop serving local businesses. Led web development and UI design, taking client websites and brand work from first design to launch, then stayed on part-time to hand off client sites.',
  },
  {
    org: 'Vanguard',
    blurb:
      "Vanguard is one of the world's largest investment management companies. Processed client requests on mutual fund, brokerage and retirement accounts, including IRA and 401(k) transactions.",
  },
  {
    org: 'JPMorgan Chase',
    blurb:
      'JPMorgan Chase is the largest bank in the United States. Managed inbound service for Chase credit card customers and held a perfect 5-star survey average for two months running across 40+ surveys.',
  },
]
