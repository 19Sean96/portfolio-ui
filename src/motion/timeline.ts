/*
 * Timelines on the shared clock. A timeline is a list of tweens placed at
 * offsets; playing it subscribes to the clock until the last one ends. Route
 * entrances, scene transitions and stage uniforms all use this one shape.
 *
 * In calm mode the clock runs slow, so a timeline would crawl. Calm mode
 * jumps a timeline to its end instead: the page lands in its final state.
 */
import type { Clock } from './clock'

export type Ease = (t: number) => number

export const ease = {
  linear: (t: number) => t,
  inOutCubic: (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  outExpo: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  outBack: (t: number) => {
    const c = 1.70158
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2)
  },
} satisfies Record<string, Ease>

export interface Tween {
  /** Seconds from the timeline's start. */
  at: number
  duration: number
  ease?: Ease
  /** Receives eased progress, 0 to 1. */
  update(progress: number): void
}

export interface Timeline {
  readonly duration: number
  add(tween: Tween): Timeline
  /** Places a tween right after the current end. */
  then(tween: Omit<Tween, 'at'> & { gap?: number }): Timeline
  /** Draws every tween at `seconds` into the timeline. */
  seek(seconds: number): void
  play(): Promise<void>
  stop(): void
}

export function timeline(clock: Clock): Timeline {
  const tweens: Tween[] = []
  let stopPlaying: (() => void) | null = null

  const self: Timeline = {
    get duration() {
      return tweens.reduce((end, t) => Math.max(end, t.at + t.duration), 0)
    },
    add(tween) {
      tweens.push(tween)
      return self
    },
    then({ gap = 0, ...tween }) {
      return self.add({ ...tween, at: self.duration + gap })
    },
    seek(seconds) {
      for (const t of tweens) {
        const raw =
          t.duration === 0
            ? seconds >= t.at
              ? 1
              : 0
            : (seconds - t.at) / t.duration
        const clamped = Math.min(1, Math.max(0, raw))
        t.update((t.ease ?? ease.inOutCubic)(clamped))
      }
    },
    play() {
      self.stop()
      const end = self.duration
      if (clock.calm || end === 0) {
        self.seek(end)
        return Promise.resolve()
      }
      return new Promise((resolve) => {
        const start = clock.time
        self.seek(0)
        const unsubscribe = clock.subscribe((time) => {
          // The clock may have gone calm mid-play; finish at once.
          const elapsed = clock.calm ? end : time - start
          self.seek(elapsed)
          if (elapsed >= end) {
            unsubscribe()
            stopPlaying = null
            resolve()
          }
        })
        stopPlaying = () => {
          unsubscribe()
          resolve()
        }
      })
    },
    stop() {
      stopPlaying?.()
      stopPlaying = null
    },
  }
  return self
}
