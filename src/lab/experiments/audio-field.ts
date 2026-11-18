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

    // Stop is live only while a source plays.
    let stopKey: HTMLButtonElement | null = null
    const button = (
      label: string,
      run: () => Promise<void>,
      words: string,
      playing: boolean,
    ) => {
      const b = document.createElement('button')
      b.type = 'button'
      b.textContent = label
      b.addEventListener('click', () => {
        run().then(
          () => {
            status.textContent = words
            if (stopKey) stopKey.disabled = !playing
          },
          () => (status.textContent = 'That source did not start.'),
        )
      })
      bar.append(b)
      return b
    }
    button('Play tone', playTone, 'Playing the built-in loop.', true)
    if (ctx.caps.mic)
      button(
        'Use mic',
        async () => {
          await listenToMic()
          ctx.discover('audio-field:mic')
        },
        'Listening to the mic. Nothing is recorded.',
        true,
      )
    stopKey = button('Stop', async () => stop(), 'Silent.', false)
    stopKey.disabled = true
    bar.append(status)
    host.append(bar)
    return () => {
      stop()
      bar.remove()
    }
  },
}

export default lab
