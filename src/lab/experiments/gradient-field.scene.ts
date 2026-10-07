import { Color } from 'three'
import { fullscreenScene, noiseGlsl } from '~/stage/fullscreen'
import type { StageScene } from '~/stage/types'
import { settings } from './gradient-field.settings'

const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform vec3 uFrom;
uniform vec3 uTo;
uniform float uWarp;
uniform float uScale;
varying vec2 vUv;
${noiseGlsl}
void main() {
  vec2 p = (vUv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) * uScale;
  vec2 q = vec2(fbm(p + uTime), fbm(p - uTime + 4.0));
  float f = fbm(p + uWarp * q + uPointer * 0.3);
  vec3 col = mix(uFrom, uTo, smoothstep(0.2, 0.9, f));
  gl_FragColor = vec4(col, 1.0);
}
`

const scene: StageScene = {
  id: 'gradient-field',
  create(ctx) {
    const from = new Color(settings.from)
    const to = new Color(settings.to)
    let t = 0
    const instance = fullscreenScene(ctx, {
      fragment,
      uniforms: {
        uFrom: { value: from },
        uTo: { value: to },
        uWarp: { value: settings.warp },
        uScale: { value: settings.scale },
      },
      post: { bloom: 0.25 },
      update(_time, delta) {
        t += delta * settings.speed
        const u = instance.material.uniforms
        u.uTime!.value = t
        from.set(settings.from)
        to.set(settings.to)
        u.uWarp!.value = settings.warp
        u.uScale!.value = settings.scale
      },
    })
    return instance
  },
}

export default scene
