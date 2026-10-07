/*
 * The scene contract. A page or a lab piece asks the stage for a scene; it
 * never makes its own renderer. The stage owns the one WebGL2 context, the
 * post chain and the clock subscription, and calls into the active scene.
 */
import type { Camera, Scene, WebGLRenderer } from 'three'
import type { Clock } from '~/motion/clock'

export interface StageContext {
  renderer: WebGLRenderer
  clock: Clock
  /** Pointer in -1..1, eased by the stage so scenes need not smooth it. */
  pointer: { x: number; y: number }
  /** Size of the drawing buffer in CSS pixels. */
  size: { width: number; height: number }
}

/** What the stage hands the post chain each frame. */
export interface PostSettings {
  bloom: number
  grain: number
  vignette: number
}

export interface StageSceneInstance {
  scene: Scene
  camera: Camera
  update(time: number, delta: number): void
  resize?(width: number, height: number): void
  /** Overrides the default post settings while this scene is shown. */
  post?: Partial<PostSettings>
  dispose(): void
}

export interface StageScene {
  id: string
  create(ctx: StageContext): StageSceneInstance
}

/** A lazy scene: the module loads only when a page asks for it. */
export type SceneLoader = () => Promise<{ default: StageScene }>
