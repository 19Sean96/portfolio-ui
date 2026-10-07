/*
 * HTML in canvas (WICG proposal). A <canvas layoutsubtree> lays out its DOM
 * children but does not paint them; the page paints them with
 * drawElementImage, so live, focusable HTML can be bent like an image.
 * Only browsers with the flag reach this module; the rest see the still.
 */
import type { LabModule } from '../types'

type DrawElement = (el: Element, x: number, y: number) => void

const lab: LabModule = {
  mount(host, ctx) {
    const canvas = document.createElement('canvas')
    canvas.setAttribute('layoutsubtree', '')
    canvas.className = 'lab-canvas'
    canvas.width = 720
    canvas.height = 360
    const card = document.createElement('div')
    card.className = 'lab-card'
    card.innerHTML =
      '<p>This card is real HTML.</p><label>Type here <input value="still editable"></label>'
    canvas.append(card)
    host.append(canvas)

    const g = canvas.getContext('2d')!
    const draw = (
      g as unknown as { drawElementImage: DrawElement }
    ).drawElementImage.bind(g)
    let found = false
    const off = ctx.clock.subscribe((time) => {
      g.clearRect(0, 0, canvas.width, canvas.height)
      g.save()
      g.translate(canvas.width / 2, canvas.height / 2)
      g.rotate(Math.sin(time * 0.8) * 0.12)
      g.transform(1, Math.sin(time * 1.3) * 0.15, 0, 1, 0, 0)
      try {
        draw(card, -card.offsetWidth / 2, -card.offsetHeight / 2)
        if (!found) {
          found = true
          ctx.discover('html-in-canvas:drawn')
        }
      } catch {
        // The flag shape changed under us; the still is the honest fallback.
      }
      g.restore()
    })
    return () => {
      off()
      canvas.remove()
    }
  },
}

export default lab
