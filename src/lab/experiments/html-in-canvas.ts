/*
 * HTML in canvas (WICG proposal). A canvas lays out its DOM children but
 * does not paint them; the page paints them with drawElementImage, so live,
 * focusable HTML can be bent like an image. Only browsers with the flag
 * reach this module; the rest see the still.
 *
 * The proposal has changed shape: the first version marked the canvas
 * `layoutsubtree`, the current one (Chrome 157) wants `content="drawable"` on
 * the canvas and `drawable` on each child. Both are set.
 */
import type { LabModule } from '../types'

type DrawElement = (el: Element, x: number, y: number) => void

/** About a second of frames that would not draw before showing the still. */
const GIVE_UP_AFTER = 60

const lab: LabModule = {
  mount(host, ctx) {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('layoutsubtree', '')
    canvas.setAttribute('content', 'drawable')
    canvas.className = 'lab-canvas'
    const card = document.createElement('div')
    card.className = 'lab-card'
    card.setAttribute('drawable', '')
    card.innerHTML =
      '<p>This card is real HTML.</p><label>Type here <input value="still editable"></label>'
    canvas.append(card)
    host.append(canvas)

    const g = canvas.getContext('2d')!
    const draw = (
      g as unknown as { drawElementImage: DrawElement }
    ).drawElementImage.bind(g)
    // The backing store follows the canvas's box at the screen's density,
    // so the card is drawn centred and sharp at any width.
    let dpr = 1
    const fit = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(canvas.clientWidth * dpr)
      canvas.height = Math.round(canvas.clientHeight * dpr)
    }
    const resize = new ResizeObserver(fit)
    resize.observe(canvas)
    fit()

    let found = false
    let failed = 0
    const off = ctx.clock.subscribe((time) => {
      g.setTransform(1, 0, 0, 1, 0, 0)
      g.clearRect(0, 0, canvas.width, canvas.height)
      g.save()
      g.scale(dpr, dpr)
      g.translate(canvas.clientWidth / 2, canvas.clientHeight / 2)
      g.rotate(Math.sin(time * 0.8) * 0.12)
      g.transform(1, Math.sin(time * 1.3) * 0.15, 0, 1, 0, 0)
      try {
        draw(card, -card.offsetWidth / 2, -card.offsetHeight / 2)
        if (!found) {
          found = true
          ctx.discover('html-in-canvas:drawn')
        }
      } catch {
        // A version of the API this code does not know: say so, show the still.
        if (!found && ++failed === GIVE_UP_AFTER)
          ctx.fallback(
            'This browser has HTML in canvas, but a version this piece cannot draw with.',
          )
      }
      g.restore()
    })
    return () => {
      off()
      resize.disconnect()
      canvas.remove()
    }
  },
}

export default lab
