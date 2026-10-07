/*
 * The lab registry. Add an experiment by writing a module under
 * experiments/, a still under public/lab/, and an entry here. Nothing in an
 * experiment loads until its page opens.
 */
import type { LabEntry } from './types'

export const labExperiments: readonly LabEntry[] = [
  {
    id: 'gradient-field',
    title: 'Gradient field',
    summary:
      'A domain-warped gradient on the shared canvas, with live controls. The successor to the old Gradient Maker.',
    tech: ['GLSL', 'three.js', 'post processing'],
    requires: ['webgl2'],
    still: '/lab/gradient-field.svg',
    status: 'ready',
    load: () => import('./experiments/gradient-field'),
  },
  {
    id: 'audio-field',
    title: 'Audio field',
    summary:
      'Sound drives the shader: a built-in tone needs no permission, or turn on the mic. A small cousin of the AV series.',
    tech: ['Web Audio', 'AnalyserNode', 'GLSL'],
    requires: ['webgl2', 'audio'],
    optional: ['mic'],
    still: '/lab/audio-field.svg',
    status: 'ready',
    load: () => import('./experiments/audio-field'),
  },
  {
    id: 'html-in-canvas',
    title: 'HTML in canvas',
    summary:
      'Live, focusable HTML drawn into a canvas and bent by it, through the proposed drawElementImage API.',
    tech: ['layoutsubtree', 'drawElementImage', 'Canvas 2D'],
    requires: ['html-in-canvas'],
    still: '/lab/html-in-canvas.svg',
    status: 'sketch',
    load: () => import('./experiments/html-in-canvas'),
  },
]

export function labEntry(id: string): LabEntry | undefined {
  return labExperiments.find((e) => e.id === id)
}
