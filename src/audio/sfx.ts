import { unlock } from './engine'
import { sfxOn } from '../app/settings'

// Unpitched, noise-based effects so they never compete with pitch training (ADR-015)
let noise: AudioBuffer | null = null

function burst(dur: number, filter: BiquadFilterType, from: number, to: number, gain: number, delay = 0) {
  if (!sfxOn()) return
  const c = unlock()
  if (!noise) {
    noise = c.createBuffer(1, c.sampleRate, c.sampleRate)
    const d = noise.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  }
  const t = c.currentTime + 0.01 + delay
  const src = c.createBufferSource()
  src.buffer = noise
  const f = c.createBiquadFilter()
  f.type = filter
  f.Q.value = 1.2
  f.frequency.setValueAtTime(from, t)
  f.frequency.exponentialRampToValueAtTime(to, t + dur)
  const g = c.createGain()
  g.gain.setValueAtTime(gain, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f).connect(g).connect(c.destination)
  src.start(t)
  src.stop(t + dur + 0.05)
}

export const sfx = {
  pop: () => burst(0.08, 'bandpass', 3000, 1200, 0.5),
  hit: () => burst(0.12, 'lowpass', 2500, 300, 0.6),
  whoosh: () => burst(0.35, 'bandpass', 600, 4000, 0.25),
  zap: () => burst(0.15, 'highpass', 6000, 1500, 0.25),
  boom: () => burst(0.4, 'lowpass', 1500, 80, 0.8),
  shield: () => burst(0.18, 'bandpass', 900, 700, 0.35),
  tick: () => burst(0.03, 'highpass', 5000, 4000, 0.3),
  cheer: () => { for (let i = 0; i < 6; i++) burst(0.06, 'bandpass', 2500 + i * 300, 1800, 0.3, i * 0.07) },
}
