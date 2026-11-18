import { Color } from 'three'
import { bands } from '~/audio/service'
import { fullscreenScene, noiseGlsl } from '~/stage/fullscreen'
import type { StageScene } from '~/stage/types'

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
uniform float uBass;
uniform float uMid;
uniform float uTreble;
uniform vec3 uInk;
uniform vec3 uHot;
varying vec2 vUv;
${noiseGlsl}
void main() {
  // Low on a phone and right on a wide screen, so at rest the ring clears
  // the words. Sized by the short side, so an upright phone keeps it whole.
  vec2 c = uResolution.x > uResolution.y ? vec2(0.66, 0.4) : vec2(0.5, 0.38);
  vec2 p = (vUv - c) * uResolution / min(uResolution.x, uResolution.y);
  float r = length(p);
  float a = atan(p.y, p.x);
  // Noise sampled round a circle, so it meets itself with no seam where
  // the angle wraps.
  float ring = 0.18 + uBass * 0.22 + fbm(vec2(cos(a), sin(a)) * 3.0 + vec2(0.0, uTime * 0.4)) * (0.05 + uMid * 0.2);
  float line = smoothstep(0.012 + uTreble * 0.02, 0.0, abs(r - ring));
  // The haze gathers around the ring and fades out toward the words.
  float haze = fbm(p * 4.0 + uTime * 0.1) * uMid * (1.0 - smoothstep(0.35, 0.8, r));
  vec3 col = uInk + uHot * (line * (0.6 + uBass) + haze * 0.4);
  gl_FragColor = vec4(col, 1.0);
}
`

const scene: StageScene = {
  id: 'audio-field',
  create(ctx) {
    const instance = fullscreenScene(ctx, {
      fragment,
      uniforms: {
        uBass: { value: 0 },
        uMid: { value: 0 },
        uTreble: { value: 0 },
        uInk: { value: new Color('#05060a') },
        uHot: { value: new Color('#ffb36b') },
      },
      post: { bloom: 0.9, grain: 0.05 },
      update() {
        const b = bands()
        const u = instance.material.uniforms
        u.uBass!.value = b.bass
        u.uMid!.value = b.mid
        u.uTreble!.value = b.treble
      },
    })
    return instance
  },
}

export default scene
