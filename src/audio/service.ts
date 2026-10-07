/*
 * The site's one AudioContext. It starts on a user gesture (browsers refuse
 * otherwise) and everything that listens reads the same analyser, so a
 * visual and the site's own sound hear the same thing.
 *
 * This is the seed. The AV series engine (d2 core/audio.js: onsets, BPM and
 * beat grid, drops, sections, stereo) is the planned replacement for
 * bands(), lifted in once the site needs more than levels.
 */

export interface Bands {
  bass: number
  mid: number
  treble: number
  level: number
}

const silent: Bands = { bass: 0, mid: 0, treble: 0, level: 0 }

interface AudioState {
  context: AudioContext
  analyser: AnalyserNode
  data: Uint8Array<ArrayBuffer>
  stopSource: (() => void) | null
}

let state: AudioState | null = null

function ensure(): AudioState {
  if (state) return state
  const context = new AudioContext()
  const analyser = context.createAnalyser()
  analyser.fftSize = 1024
  analyser.smoothingTimeConstant = 0.8
  state = {
    context,
    analyser,
    data: new Uint8Array(analyser.frequencyBinCount),
    stopSource: null,
  }
  return state
}

/** Average of bins between two frequencies, 0 to 1. */
function band(s: AudioState, low: number, high: number): number {
  const hz = s.context.sampleRate / 2 / s.data.length
  const from = Math.max(0, Math.floor(low / hz))
  const to = Math.min(s.data.length - 1, Math.ceil(high / hz))
  let sum = 0
  for (let i = from; i <= to; i++) sum += s.data[i]!
  return sum / ((to - from + 1) * 255)
}

export function bands(): Bands {
  if (!state || !state.stopSource) return silent
  state.analyser.getByteFrequencyData(state.data)
  const bass = band(state, 30, 160)
  const mid = band(state, 160, 2000)
  const treble = band(state, 2000, 10000)
  return { bass, mid, treble, level: (bass + mid + treble) / 3 }
}

export function stop() {
  state?.stopSource?.()
  if (state) state.stopSource = null
}

/**
 * A small generated loop: a detuned pad and a kick on every beat at 112 BPM.
 * It needs no permission, so the audio pieces always have something to hear.
 */
export async function playTone(): Promise<void> {
  const s = ensure()
  stop()
  await s.context.resume()
  const ctx = s.context
  const out = ctx.createGain()
  out.gain.value = 0.18
  out.connect(s.analyser)
  s.analyser.connect(ctx.destination)

  const pad = [110, 164.81, 220.5].map((f) => {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.value = f
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 900
    osc.connect(filter).connect(out)
    osc.start()
    return osc
  })

  const beat = 60 / 112
  let next = ctx.currentTime + 0.05
  const kick = () => {
    while (next < ctx.currentTime + 0.2) {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.frequency.setValueAtTime(140, next)
      osc.frequency.exponentialRampToValueAtTime(40, next + 0.15)
      gain.gain.setValueAtTime(1.4, next)
      gain.gain.exponentialRampToValueAtTime(0.001, next + 0.3)
      osc.connect(gain).connect(out)
      osc.start(next)
      osc.stop(next + 0.3)
      next += beat
    }
  }
  kick()
  const timer = window.setInterval(kick, 50)

  s.stopSource = () => {
    window.clearInterval(timer)
    for (const osc of pad) osc.stop()
    out.disconnect()
    s.analyser.disconnect()
  }
}

/** Listens to the mic. The mic is analysed, never played back. */
export async function listenToMic(): Promise<void> {
  const s = ensure()
  stop()
  await s.context.resume()
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  const source = s.context.createMediaStreamSource(stream)
  source.connect(s.analyser)
  s.stopSource = () => {
    source.disconnect()
    for (const track of stream.getTracks()) track.stop()
  }
}
