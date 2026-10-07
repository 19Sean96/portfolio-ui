/*
 * The experiment contract. A lab piece is a lazy module whose default export
 * mounts into a host element and returns its own teardown. It reaches the
 * shared canvas through ctx.stage, never a renderer of its own.
 */
import type { Clock } from '~/motion/clock'
import type { SceneLoader } from '~/stage/types'
import type { Capabilities, Capability } from './capabilities'

export interface LabContext {
  clock: Clock
  caps: Capabilities
  /** Puts a scene on the shared canvas; the lab page restores it on exit. */
  showScene(loader: SceneLoader): Promise<void>
  /** Marks an in-experiment discovery, e.g. "used the mic". */
  discover(id: string): void
}

export interface LabModule {
  mount(host: HTMLElement, ctx: LabContext): () => void
}

export interface LabEntry {
  id: string
  title: string
  summary: string
  /** What it shows off, in a few words, for the index. */
  tech: string[]
  requires: Capability[]
  /** Optional needs: the piece runs without them and offers more with. */
  optional?: Capability[]
  /** A still image under /lab/, shown in the index and as the fallback. */
  still: string
  status: 'ready' | 'sketch'
  load(): Promise<{ default: LabModule }>
}
