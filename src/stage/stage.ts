/*
 * The stage: one persistent canvas behind the page, one WebGL2 renderer,
 * one post chain, driven by the shared clock. Pages ask for a scene with
 * show(); the stage fades out, swaps and fades in on a timeline.
 *
 * This module imports three, so it loads lazily (StageProvider) and never
 * runs on the server.
 */
import { WebGLRenderer } from 'three'
import type { Clock } from '~/motion/clock'
import { ease, timeline } from '~/motion/timeline'
import { createPost } from './post'
import type { SceneLoader, StageContext, StageSceneInstance } from './types'

export interface Stage {
  show(loader: SceneLoader): Promise<void>
  /** The scene id on screen, or null before the first one lands. */
  readonly current: string | null
  dispose(): void
}

const FADE = 0.45

export function createStage(canvas: HTMLCanvasElement, clock: Clock): Stage {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: 'high-performance',
  })
  const dpr = () => Math.min(window.devicePixelRatio, 2)
  renderer.setPixelRatio(dpr())

  const pointer = { x: 0, y: 0 }
  const target = { x: 0, y: 0 }
  const ctx: StageContext = {
    renderer,
    clock,
    pointer,
    size: { width: window.innerWidth, height: window.innerHeight },
  }
  const post = createPost(renderer)

  let active: { id: string; instance: StageSceneInstance } | null = null
  let request = 0

  function resize() {
    ctx.size = { width: window.innerWidth, height: window.innerHeight }
    renderer.setPixelRatio(dpr())
    renderer.setSize(ctx.size.width, ctx.size.height, false)
    post.setSize(ctx.size.width, ctx.size.height)
    active?.instance.resize?.(ctx.size.width, ctx.size.height)
  }

  function onPointer(e: PointerEvent) {
    target.x = (e.clientX / window.innerWidth) * 2 - 1
    target.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onPointer, { passive: true })

  const unsubscribe = clock.subscribe((time, delta) => {
    if (!active) return
    const k = 1 - Math.exp(-delta * 4)
    pointer.x += (target.x - pointer.x) * k
    pointer.y += (target.y - pointer.y) * k
    active.instance.update(time, delta)
    post.render(active.instance, time)
  })

  function fadeTo(value: number) {
    const from = post.fade.value
    return timeline(clock)
      .add({
        at: 0,
        duration: FADE,
        ease: ease.inOutCubic,
        update: (p) => (post.fade.value = from + (value - from) * p),
      })
      .play()
  }

  return {
    get current() {
      return active?.id ?? null
    },
    async show(loader) {
      const mine = ++request
      const [{ default: scene }] = await Promise.all([
        loader(),
        active ? fadeTo(0) : Promise.resolve(),
      ])
      // A later show() won the race; leave the stage to it.
      if (mine !== request) return
      if (active?.id === scene.id) {
        await fadeTo(1)
        return
      }
      active?.instance.dispose()
      const instance = scene.create(ctx)
      instance.resize?.(ctx.size.width, ctx.size.height)
      active = { id: scene.id, instance }
      await fadeTo(1)
    },
    dispose() {
      unsubscribe()
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
      active?.instance.dispose()
      post.dispose()
      renderer.dispose()
    },
  }
}
