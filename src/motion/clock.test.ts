import { describe, expect, it } from 'vitest'
import { CALM_SCALE, createClock } from './clock'
import { timeline } from './timeline'

function fakeScheduler() {
  let now = 0
  let queued: (() => void) | null = null
  return {
    scheduler: {
      now: () => now,
      request: (fn: () => void) => {
        queued = fn
        return 1
      },
      cancel: () => {
        queued = null
      },
    },
    /** Advances wall time by ms and runs the queued frame. */
    frame(ms: number) {
      now += ms
      const fn = queued
      queued = null
      fn?.()
    },
    get running() {
      return queued !== null
    },
  }
}

describe('clock', () => {
  it('runs only while something listens', () => {
    const f = fakeScheduler()
    const c = createClock(f.scheduler)
    expect(f.running).toBe(false)
    const off = c.subscribe(() => {})
    expect(f.running).toBe(true)
    off()
    expect(f.running).toBe(false)
  })

  it('scales time in calm mode and caps long frames', () => {
    const f = fakeScheduler()
    const c = createClock(f.scheduler)
    c.subscribe(() => {})
    f.frame(0)
    f.frame(16)
    expect(c.time).toBeCloseTo(0.016)
    c.setCalm(true)
    f.frame(16)
    expect(c.time).toBeCloseTo(0.016 + 0.016 * CALM_SCALE)
    c.setCalm(false)
    f.frame(5000)
    expect(c.time).toBeCloseTo(0.016 + 0.016 * CALM_SCALE + 0.05)
  })

  it('pauses without a jump on resume', () => {
    const f = fakeScheduler()
    const c = createClock(f.scheduler)
    c.subscribe(() => {})
    f.frame(0)
    f.frame(10)
    c.setPaused(true)
    expect(f.running).toBe(false)
    c.setPaused(false)
    f.frame(60_000)
    expect(c.time).toBeCloseTo(0.01)
  })
})

describe('timeline', () => {
  it('plays tweens in order on the clock', async () => {
    const f = fakeScheduler()
    const c = createClock(f.scheduler)
    const seen: number[] = []
    const tl = timeline(c)
      .add({
        at: 0,
        duration: 0.03,
        ease: (t) => t,
        update: (p) => seen.push(p),
      })
      .then({ duration: 0.01, update: () => {} })
    expect(tl.duration).toBeCloseTo(0.04)
    const done = tl.play()
    for (let i = 0; i < 6; i++) f.frame(i === 0 ? 0 : 10)
    await done
    expect(seen.at(-1)).toBe(1)
    expect(f.running).toBe(false)
  })

  it('jumps to the end in calm mode', async () => {
    const f = fakeScheduler()
    const c = createClock(f.scheduler)
    c.setCalm(true)
    let last = -1
    await timeline(c)
      .add({ at: 0, duration: 2, update: (p) => (last = p) })
      .play()
    expect(last).toBe(1)
  })
})
