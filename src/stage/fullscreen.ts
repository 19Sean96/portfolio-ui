/*
 * A helper for scenes that are one full-screen fragment shader. The shader
 * gets uTime, uPointer, uResolution and whatever uniforms the scene adds.
 */
import {
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  type IUniform,
} from 'three'
import type { StageContext, StageSceneInstance } from './types'

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

export interface FullscreenOptions {
  fragment: string
  uniforms?: Record<string, IUniform>
  post?: StageSceneInstance['post']
  /** Runs each frame after the shared uniforms are set. */
  update?(time: number, delta: number): void
}

export function fullscreenScene(
  ctx: StageContext,
  options: FullscreenOptions,
): StageSceneInstance & { material: ShaderMaterial } {
  const scene = new Scene()
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const geometry = new PlaneGeometry(2, 2)
  const material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: options.fragment,
    uniforms: {
      uTime: { value: 0 },
      uPointer: { value: new Vector2() },
      uResolution: { value: new Vector2(ctx.size.width, ctx.size.height) },
      ...options.uniforms,
    },
    depthTest: false,
    depthWrite: false,
  })
  scene.add(new Mesh(geometry, material))

  return {
    scene,
    camera,
    material,
    post: options.post,
    update(time, delta) {
      material.uniforms.uTime!.value = time
      ;(material.uniforms.uPointer!.value as Vector2).set(
        ctx.pointer.x,
        ctx.pointer.y,
      )
      options.update?.(time, delta)
    },
    resize(width, height) {
      ;(material.uniforms.uResolution!.value as Vector2).set(width, height)
    },
    dispose() {
      geometry.dispose()
      material.dispose()
    },
  }
}

/** Shared GLSL: hash, value noise and fbm. */
export const noiseGlsl = /* glsl */ `
float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return v;
}
`
