import type { Step } from '../music/theory'

// shortcut: synthesized piano-like voice; sampled multi-instrument playback arrives in 0.3.0 (ADR-004)
let ctx: AudioContext | null = null
let out: GainNode
let active: OscillatorNode[] = []

/** Create/resume the AudioContext; must run inside a user gesture on iOS/Safari. */
export function unlock() {
  if (!ctx) {
    ctx = new AudioContext({ latencyHint: 'interactive' })
    const comp = ctx.createDynamicsCompressor()
    out = ctx.createGain()
    out.gain.value = 0.5
    out.connect(comp).connect(ctx.destination)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export const isRunning = () => ctx?.state === 'running'

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

function voice(c: AudioContext, midi: number, t: number, dur: number, vel: number) {
  const f = freq(midi)
  const env = c.createGain()
  env.gain.setValueAtTime(0.0001, t)
  env.gain.linearRampToValueAtTime(vel, t + 0.008)
  env.gain.exponentialRampToValueAtTime(vel * 0.35, t + 0.35)
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.5)
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(Math.min(f * 10, 12000), t)
  lp.frequency.exponentialRampToValueAtTime(Math.max(f * 2, 400), t + dur + 0.5)
  lp.connect(env).connect(out)
  for (const [type, mult, g] of [['triangle', 1, 1], ['sine', 2, 0.25], ['sine', 3, 0.08]] as const) {
    const o = c.createOscillator()
    const og = c.createGain()
    o.type = type
    o.frequency.value = f * mult
    og.gain.value = g
    o.connect(og).connect(lp)
    o.start(t)
    o.stop(t + dur + 0.6)
    active.push(o)
  }
}

export function stop() {
  active.forEach((o) => { try { o.stop() } catch { /* already stopped */ } })
  active = []
}

/** Schedule steps back-to-back on the audio clock (never setTimeout, criteria U1). Replaces anything playing. */
export function play(steps: Step[]) {
  const c = unlock()
  stop()
  let t = c.currentTime + 0.05
  for (const s of steps) {
    s.notes.forEach((n) => voice(c, n, t, s.dur, 0.6 / Math.sqrt(s.notes.length)))
    t += s.dur
  }
}
