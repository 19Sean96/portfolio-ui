/*
 * Page entrances on the shared timeline. Children marked data-enter rise
 * and fade in, staggered in document order. CSS hides them first only when
 * scripts run (the `js` class on <html>), so a page without JS reads fine.
 */
import { useEffect, type RefObject } from 'react'
import { clock } from './clock'
import { ease, timeline } from './timeline'

export function useEntrance(ref: RefObject<HTMLElement | null>, key?: unknown) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const items = [...root.querySelectorAll<HTMLElement>('[data-enter]')]
    const tl = timeline(clock())
    items.forEach((el, i) => {
      tl.add({
        at: Math.min(i, 8) * 0.07,
        duration: 0.7,
        ease: ease.outExpo,
        update: (p) => {
          el.style.opacity = String(p)
          el.style.transform = p >= 1 ? '' : `translateY(${(1 - p) * 18}px)`
        },
      })
    })
    void tl.play()
    return () => tl.stop()
  }, [ref, key])
}
