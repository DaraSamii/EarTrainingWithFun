import type { Inst, Perc, Step } from '../music/theory'

// Samples: nbrosowsky/tonejs-instruments, CC-BY 3.0 (credited in Profile → About). Loaded from jsDelivr,
// pinned to a commit so the files never change under us (ADR-018).
// shortcut: CDN-hosted samples; self-host + service-worker cache with the PWA milestone.
const CDN = 'https://cdn.jsdelivr.net/gh/nbrosowsky/tonejs-instruments@622c2f1c32c8cfce4158ddc3eb26e518ddef37e5/samples'

const SAMPLES: Record<Inst, [string, string]> = {
  piano: ['piano', 'A1 C2 Ds2 Fs2 A2 C3 Ds3 Fs3 A3 C4 Ds4 Fs4 A4 C5 Ds5 Fs5 A5 C6 Ds6 Fs6 A6'],
  flute: ['flute', 'C4 E4 A4 C5 E5 A5 C6 E6 A6 C7'],
  guitar: ['guitar-acoustic', 'E2 G2 As2 Cs3 E3 G3 As3 Cs4 E4 G4 As4 Cs5'],
  trumpet: ['trumpet', 'F3 A3 C4 Ds4 F4 G4 As4 D5 F5 A5 C6'],
  violin: ['violin', 'G3 A3 C4 E4 G4 A4 C5 E5 G5 A5 C6 E6'],
  cello: ['cello', 'C2 E2 G2 As2 Cs3 E3 G3 As3 Cs4 E4 G4 C5'],
  clarinet: ['clarinet', 'D3 F3 As3 D4 F4 As4 D5 F5 As5 D6'],
  saxophone: ['saxophone', 'Cs3 E3 G3 As3 Cs4 E4 G4 As4 Cs5 E5 G5 A5'],
  xylophone: ['xylophone', 'G4 C5 G5 C6 G6 C7'],
  horn: ['french-horn', 'C2 G2 D3 F3 A3 C4 F5'],
  trombone: ['trombone', 'Cs2 F2 Gs2 C3 Ds3 F3 Gs3 C4 Ds4 F4'],
  harp: ['harp', 'G1 D2 G3 C3 E3 B3 D4 F4 A4 C5 E5 G5'],
}

/** Ring-out after a note ends, by instrument family */
const RELEASE: Partial<Record<Inst, number>> = { piano: 0.8, guitar: 0.8, harp: 1, xylophone: 0.6 }

const PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }
export const sampleMidi = (name: string) => PC[name[0]] + (name[1] === 's' ? 1 : 0) + (Number(name.slice(name[1] === 's' ? 2 : 1)) + 1) * 12

let ctx: AudioContext | null = null
let out: GainNode
let active: AudioScheduledSourceNode[] = []
const banks = new Map<Inst, Map<number, AudioBuffer>>()
const loading = new Map<Inst, Promise<void>>()

/** Create/resume the AudioContext; must run inside a user gesture on iOS/Safari. */
export function unlock() {
  if (!ctx) {
    ctx = new AudioContext({ latencyHint: 'interactive' })
    const comp = ctx.createDynamicsCompressor()
    out = ctx.createGain()
    out.gain.value = 0.7
    out.connect(comp).connect(ctx.destination)
    void loadInstruments(['piano'])
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export const isRunning = () => ctx?.state === 'running'
export const isLoaded = (i: Inst) => banks.has(i)

/** Fetch and decode an instrument's samples once; playback falls back to the synth until ready (criteria U3) */
export function loadInstruments(insts: Inst[]) {
  const c = ctx ?? unlock()
  return Promise.all(insts.map((inst) => {
    if (!loading.has(inst)) {
      const [dir, names] = SAMPLES[inst]
      const p = Promise.all(names.split(' ').map(async (n) => {
        const res = await fetch(`${CDN}/${dir}/${n}.mp3`)
        if (!res.ok) throw new Error(`${dir}/${n}: ${res.status}`)
        return [sampleMidi(n), await c.decodeAudioData(await res.arrayBuffer())] as const
      })).then((pairs) => { banks.set(inst, new Map(pairs)) })
        .catch((e) => { loading.delete(inst); console.warn('[audio] sample load failed, using synth', e) })
      loading.set(inst, p)
    }
    return loading.get(inst)!
  }))
}

const freq = (midi: number) => 440 * 2 ** ((midi - 69) / 12)

function sampled(c: AudioContext, bank: Map<number, AudioBuffer>, inst: Inst, midi: number, t: number, dur: number, vel: number, short = false) {
  let best = 0
  let dist = Infinity
  for (const m of bank.keys()) if (Math.abs(m - midi) < dist) { dist = Math.abs(m - midi); best = m }
  const src = c.createBufferSource()
  src.buffer = bank.get(best)!
  src.playbackRate.value = 2 ** ((midi - best) / 12)
  const rel = short ? 0.06 : RELEASE[inst] ?? 0.25
  const env = c.createGain()
  env.gain.setValueAtTime(vel, t)
  env.gain.setValueAtTime(vel, t + dur)
  env.gain.exponentialRampToValueAtTime(0.0001, t + dur + rel)
  src.connect(env).connect(out)
  src.start(t)
  src.stop(t + dur + rel + 0.05)
  active.push(src)
}

function synth(c: AudioContext, midi: number, t: number, dur: number, vel: number) {
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

let noise: AudioBuffer | null = null

/** Synthesized drum kit: clear, consistent, needs no samples */
function drum(c: AudioContext, kind: Perc, t: number, vel: number) {
  if (!noise) {
    noise = c.createBuffer(1, c.sampleRate, c.sampleRate)
    const d = noise.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  const env = c.createGain()
  env.connect(out)
  if (kind === 'kick') {
    const o = c.createOscillator()
    o.frequency.setValueAtTime(150, t)
    o.frequency.exponentialRampToValueAtTime(45, t + 0.15)
    env.gain.setValueAtTime(vel, t)
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.35)
    o.connect(env)
    o.start(t)
    o.stop(t + 0.4)
    active.push(o)
    return
  }
  if (kind === 'click' || kind === 'accent') {
    // woodblock: short sine blip
    const o = c.createOscillator()
    o.frequency.value = kind === 'accent' ? 1760 : 1180
    env.gain.setValueAtTime(vel * (kind === 'accent' ? 0.9 : 0.6), t)
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.06)
    o.connect(env)
    o.start(t)
    o.stop(t + 0.08)
    active.push(o)
    return
  }
  const src = c.createBufferSource()
  src.buffer = noise
  const f = c.createBiquadFilter()
  f.type = kind === 'hat' ? 'highpass' : 'bandpass'
  f.frequency.value = kind === 'hat' ? 7000 : 1800
  const dur = kind === 'hat' ? 0.05 : 0.18
  env.gain.setValueAtTime(vel * (kind === 'hat' ? 0.4 : 0.8), t)
  env.gain.exponentialRampToValueAtTime(0.001, t + dur)
  src.connect(f).connect(env)
  src.start(t)
  src.stop(t + dur + 0.02)
  active.push(src)
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
    const inst = s.inst ?? 'piano'
    const bank = banks.get(inst)
    const vel = ((s.vel ?? 1) * 0.8) / Math.sqrt(s.notes.length || 1)
    const ring = s.len ?? s.dur
    s.notes.forEach((n) => (bank ? sampled(c, bank, inst, n, t, ring, vel, s.len !== undefined) : synth(c, n, t, ring, vel * 0.75)))
    s.perc?.forEach((k) => drum(c, k, t, s.vel ?? 1))
    t += s.dur
  }
}

export const duration = (steps: Step[]) => steps.reduce((a, s) => a + s.dur, 0)
