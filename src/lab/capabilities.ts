/*
 * What this browser can do. A lab entry lists what it needs; the lab page
 * runs it only when every need is met and shows its still otherwise, with
 * the reason in words.
 */

export const capabilityWords = {
  webgl2: 'WebGL 2',
  webgpu: 'WebGPU',
  audio: 'Web Audio',
  mic: 'a microphone',
  'html-in-canvas': 'HTML in canvas (an experimental Chrome flag)',
} as const

export type Capability = keyof typeof capabilityWords
export type Capabilities = Record<Capability, boolean>

export const noCapabilities: Capabilities = {
  webgl2: false,
  webgpu: false,
  audio: false,
  mic: false,
  'html-in-canvas': false,
}

function hasWebgl2(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

let cached: Capabilities | null = null

/** detectCapabilities, read once per page load. */
export function browserCapabilities(): Capabilities {
  cached ??= detectCapabilities()
  return cached
}

/** Reads the browser. Server render gets noCapabilities. */
export function detectCapabilities(): Capabilities {
  if (typeof window === 'undefined') return noCapabilities
  return {
    webgl2: hasWebgl2(),
    webgpu: 'gpu' in navigator,
    audio: typeof AudioContext !== 'undefined',
    mic: !!navigator.mediaDevices?.getUserMedia,
    // WICG html-in-canvas: <canvas layoutsubtree> plus drawElementImage.
    'html-in-canvas':
      typeof CanvasRenderingContext2D !== 'undefined' &&
      'drawElementImage' in CanvasRenderingContext2D.prototype,
  }
}

export function missing(
  requires: readonly Capability[],
  caps: Capabilities,
): Capability[] {
  return requires.filter((c) => !caps[c])
}
