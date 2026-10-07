/*
 * The reading scene for inner pages: the same field as drift, darker and
 * slower, so text sits on it without a fight.
 */
import { Color } from 'three'
import { fullscreenScene, noiseGlsl } from '../fullscreen'
import type { StageScene } from '../types'

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform vec3 uInk;
uniform vec3 uTint;
varying vec2 vUv;
${noiseGlsl}
void main() {
  vec2 p = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) * 1.6;
  float f = fbm(p + vec2(uTime * 0.02, -uTime * 0.015) + uPointer * 0.05);
  vec3 col = mix(uInk, uTint, smoothstep(0.3, 0.9, f) * 0.6);
  gl_FragColor = vec4(col, 1.0);
}
`

const scene: StageScene = {
  id: 'quiet',
  create(ctx) {
    return fullscreenScene(ctx, {
      fragment,
      uniforms: {
        uInk: { value: new Color('#07080c') },
        uTint: { value: new Color('#121a26') },
      },
      post: { bloom: 0, vignette: 0.6 },
    })
  },
}

export default scene
