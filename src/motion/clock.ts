/*
 * The one clock. Every moving thing on the site (stage scenes, timelines,
 * lab pieces, DOM tweens) reads time from here, so they stay in step and one
 * switch slows all of it.
 *
 * Calm mode follows `prefers-reduced-motion` and scales time down instead of
 * stopping it: a scene still draws, it just drifts. A hidden tab pauses the
 * loop and the next frame resumes without a jump.
 */

export type Tick = (time: number, delta: number) => void

export interface Scheduler {
  now(): number
  request(fn: () => void): number
  cancel(id: number): void
}

export const CALM_SCALE = 0.15
/** A frame longer than this (tab switch, debugger) counts as this long. */
const MAX_DELTA = 1 / 20

export interface Clock {
  /** Seconds of scaled time since the clock started. */
  readonly time: number
  readonly calm: boolean
  subscribe(tick: Tick): () => void
  setCalm(calm: boolean): void
  setPaused(paused: boolean): void
  /** Runs one frame by hand; tests and the still renderer use it. */
  step(): void
}

export function createClock(scheduler: Scheduler): Clock {
  const ticks = new Set<Tick>()
  let time = 0
  let last: number | null = null
  let frame: number | null = null
  let calm = false
  let paused = false

  function step() {
    const now = scheduler.now() / 1000
    const raw = last === null ? 0 : Math.min(now - last, MAX_DELTA)
    last = now
    const delta = raw * (calm ? CALM_SCALE : 1)
    time += delta
    for (const tick of ticks) tick(time, delta)
  }

  function loop() {
    frame = null
    step()
    // A tick may have unsubscribed the last listener or paused the clock.
    if (ticks.size > 0 && !paused && frame === null)
      frame = scheduler.request(loop)
  }

  function sync() {
    const run = ticks.size > 0 && !paused
    if (run && frame === null) {
      last = null
      frame = scheduler.request(loop)
    } else if (!run && frame !== null) {
      scheduler.cancel(frame)
      frame = null
    }
  }

  return {
    get time() {
      return time
    },
    get calm() {
      return calm
    },
    subscribe(tick) {
      ticks.add(tick)
      sync()
      return () => {
        ticks.delete(tick)
        sync()
      }
    },
    setCalm(next) {
      calm = next
    },
    setPaused(next) {
      paused = next
      sync()
    },
    step,
  }
}

let shared: Clock | null = null

/** The browser's clock, created on first use and wired to the page. */
export function clock(): Clock {
  if (shared) return shared
  if (typeof window === 'undefined')
    throw new Error('The clock runs in the browser only.')
  const c = createClock({
    now: () => performance.now(),
    request: (fn) => requestAnimationFrame(fn),
    cancel: (id) => cancelAnimationFrame(id),
  })
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  c.setCalm(reduced.matches)
  reduced.addEventListener('change', (e) => c.setCalm(e.matches))
  document.addEventListener('visibilitychange', () =>
    c.setPaused(document.hidden),
  )
  shared = c
  return c
}
