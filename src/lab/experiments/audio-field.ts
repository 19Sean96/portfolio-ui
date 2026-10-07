/*
 * Sound in, shader out. The built-in tone needs no permission; the mic is
 * offered only where the browser has one.
 */
import { listenToMic, playTone, stop } from '~/audio/service'
import type { LabModule } from '../types'

const lab: LabModule = {
  mount(host, ctx) {
    void ctx.showScene(() => import('./audio-field.scene'))
    const bar = document.createElement('div')
    bar.className = 'lab-controls'
    const status = document.createElement('p')
    status.setAttribute('role', 'status')
    status.textContent = 'Silent. Pick a source.'

    const button = (label: string, run: () => Promise<void>, words: string) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = label
      b.addEventListener('click', () => {
        run().then(
          () => (status.textContent = words),
          () => (status.textContent = 'That source did not start.'),
        )
      })
      bar.append(b)
    }
    button('Play tone', playTone, 'Playing the built-in loop.')
    if (ctx.caps.mic)
      button(
        'Use mic',
        async () => {
          await listenToMic()
          ctx.discover('audio-field:mic')
        },
        'Listening to the mic. Nothing is recorded.',
      )
    button('Stop', async () => stop(), 'Silent.')
    bar.append(status)
    host.append(bar)
    return () => {
      stop()
      bar.remove()
    }
  },
}

export default lab
