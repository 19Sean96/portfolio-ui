import type { Project } from '../schema'

export const avSeries: Project = {
  slug: 'av-series',
  title: 'AV',
  subtitle: 'Audio visualizer series',
  summary:
    'Full-screen audio visualizers in raw WebGL2 and GLSL, all listening through one shared Web Audio analysis engine.',
  body: [
    'Each piece is its own art piece at its own subdomain. They share one listening engine: frequency bands, onsets, a BPM and beat-grid tracker, drops, builds, sections and stereo.',
    'Five pieces are built and live. BABEL and SUTURE hold their slots until they ship. Each picks its own rendering stack, from shader feedback to a raymarched processional hall.',
    'Placeholder: the full case study follows notes/d2-case-study-outline.md.',
  ],
  role: ['artist', 'engineer'],
  years: '2025–2026',
  status: 'live',
  tech: ['WebGL2', 'GLSL', 'Web Audio', 'Cloudflare Workers'],
  links: [],
  pieces: [
    {
      name: 'PULSEFORM',
      status: 'built',
      href: 'https://av1.seananthony.io',
      line: 'A shader feedback organism, tunnel and strands, cut to the beat grid.',
    },
    {
      name: 'PHOSPHOR',
      status: 'built',
      href: 'https://av2.seananthony.io',
      line: 'A vectorscope stylus striking a resonant wave medium. Silence is black.',
    },
    {
      name: 'MAW',
      status: 'built',
      href: 'https://av3.seananthony.io',
      line: 'A raymarched creature eating a 262,144-particle storm inside a feedback furnace.',
    },
    {
      name: 'SERAPH',
      status: 'built',
      href: 'https://av4.seananthony.io',
      line: 'A machine seraph of engraved-light rings, with a vectorscope halo that speaks.',
    },
    {
      name: 'SANCTUM',
      status: 'built',
      href: 'https://av5.seananthony.io',
      line: 'A first-person processional hall that advances one bay per bar.',
    },
    {
      name: 'BABEL',
      status: 'in-progress',
      line: 'The set builds a city on the beat, and drops blow it into stars.',
    },
    {
      name: 'SUTURE',
      status: 'in-progress',
      line: '347 spectral filaments in three folded sheets, inside a seven-fold tunnel.',
    },
  ],
  media: {
    kind: 'image',
    src: '/media/work/av-series.jpg',
    alt: 'MAW: a raymarched creature in a storm of debris',
  },
  feature: 90,
  experiment: 'audio-field',
}
