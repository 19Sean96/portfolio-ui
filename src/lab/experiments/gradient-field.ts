/*
 * Controls for the gradient field. The scene runs on the shared canvas;
 * this module only builds the panel and writes settings.
 */
import type { LabModule } from '../types'
import { settings } from './gradient-field.settings'

type Key = keyof typeof settings

const controls: {
  key: Key
  label: string
  type: 'color' | 'range'
  min?: number
  max?: number
  step?: number
}[] = [
  { key: 'from', label: 'From', type: 'color' },
  { key: 'to', label: 'To', type: 'color' },
  { key: 'warp', label: 'Warp', type: 'range', min: 0, max: 8, step: 0.1 },
  { key: 'scale', label: 'Scale', type: 'range', min: 0.5, max: 6, step: 0.1 },
  { key: 'speed', label: 'Speed', type: 'range', min: 0, max: 0.5, step: 0.01 },
]

const lab: LabModule = {
  mount(host, ctx) {
    void ctx.showScene(() => import('./gradient-field.scene'))
    const form = document.createElement('form')
    form.className = 'lab-controls'
    form.addEventListener('submit', (e) => e.preventDefault())
    for (const c of controls) {
      const label = document.createElement('label')
      const input = document.createElement('input')
      input.type = c.type
      input.name = c.key
      if (c.type === 'range') {
        input.min = String(c.min)
        input.max = String(c.max)
        input.step = String(c.step)
      }
      input.value = String(settings[c.key])
      input.addEventListener('input', () => {
        const value = c.type === 'range' ? Number(input.value) : input.value
        ;(settings as Record<Key, string | number>)[c.key] = value
        if (c.key === 'warp' && Number(value) >= 7.5)
          ctx.discover('gradient-field:max-warp')
      })
      label.append(c.label, input)
      form.append(label)
    }
    host.append(form)
    return () => form.remove()
  },
}

export default lab
