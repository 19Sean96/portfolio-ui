/*
 * The home scene: domain-warped fbm in the site's ink and accent, leaning
 * toward the pointer. It reads as a slow ink cloud behind the hero.
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
uniform vec3 uAccent;
uniform vec3 uGlow;
uniform float uEnergy;
varying vec2 vUv;
${noiseGlsl}
void main() {
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) * 2.4;
  p += uPointer * 0.25;
  float t = uTime * 0.06;
  vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p + 3.0 * q + vec2(1.7, 9.2) + t * 1.5),
    fbm(p + 3.0 * q + vec2(8.3, 2.8) - t * 1.2)
  );
  float f = fbm(p + 3.5 * r);
  vec3 col = mix(uInk, uAccent, smoothstep(0.25, 0.85, f));
  col = mix(col, uGlow, pow(clamp(length(r) * f, 0.0, 1.0), 3.0) * (0.6 + uEnergy));
  gl_FragColor = vec4(col, 1.0);
}
`

const scene: StageScene = {
  id: 'drift',
  create(ctx) {
    return fullscreenScene(ctx, {
      fragment,
      uniforms: {
        uInk: { value: new Color('#07080c') },
        uAccent: { value: new Color('#1f4a70') },
        uGlow: { value: new Color('#ff9a62') },
        uEnergy: { value: 0 },
      },
      post: { bloom: 0.5 },
    })
  },
}

export default scene
