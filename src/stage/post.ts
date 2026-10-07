/*
 * The post chain: render, bloom, a finish pass (grain, vignette and the
 * stage fade), then output. One chain for every scene; a scene tunes it
 * through `post` instead of building its own.
 */
import { Vector2, type WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import type { PostSettings, StageSceneInstance } from './types'

export const defaultPost: PostSettings = {
  bloom: 0.35,
  grain: 0.03,
  vignette: 0.45,
}

const finishShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: defaultPost.grain },
    uVignette: { value: defaultPost.vignette },
    uFade: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uFade;
    varying vec2 vUv;
    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }
    void main() {
      vec4 color = texture2D(tDiffuse, vUv);
      float grain = (rand(vUv * 1000.0 + fract(uTime)) - 0.5) * uGrain;
      float d = distance(vUv, vec2(0.5));
      float vig = 1.0 - smoothstep(0.35, 0.95, d) * uVignette;
      gl_FragColor = vec4((color.rgb + grain) * vig * uFade, color.a);
    }
  `,
}

export interface PostChain {
  render(instance: StageSceneInstance, time: number): void
  setSize(width: number, height: number): void
  /** 0 is black, 1 is the scene; the stage tweens this between scenes. */
  fade: { value: number }
  dispose(): void
}

export function createPost(renderer: WebGLRenderer): PostChain {
  const size = renderer.getSize(new Vector2())
  const composer = new EffectComposer(renderer)
  const render = new RenderPass(undefined as never, undefined as never)
  const bloom = new UnrealBloomPass(size, defaultPost.bloom, 0.6, 0.2)
  const finish = new ShaderPass(finishShader)
  composer.addPass(render)
  composer.addPass(bloom)
  composer.addPass(finish)
  composer.addPass(new OutputPass())

  const fade = finish.uniforms.uFade as { value: number }

  return {
    fade,
    render(instance, time) {
      const post = { ...defaultPost, ...instance.post }
      render.scene = instance.scene
      render.camera = instance.camera
      bloom.strength = post.bloom
      bloom.enabled = post.bloom > 0
      finish.uniforms.uGrain!.value = post.grain
      finish.uniforms.uVignette!.value = post.vignette
      finish.uniforms.uTime!.value = time
      composer.render()
    },
    setSize(width, height) {
      composer.setSize(width, height)
    },
    dispose() {
      composer.dispose()
    },
  }
}
