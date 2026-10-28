import { vi } from 'vitest'

// The Web Audio engine is not available in jsdom: every test that renders screens mocks it like this.
export const audio = { play: vi.fn(), stop: vi.fn() }
vi.mock('../audio/engine', () => ({
  play: (...a: unknown[]) => audio.play(...a),
  stop: () => audio.stop(),
  unlock: () => ({ currentTime: 0 }),
  isRunning: () => true,
  isLoaded: () => true,
  loadInstruments: () => Promise.resolve([]),
  duration: (s: { dur: number }[]) => s.reduce((a, x) => a + x.dur, 0),
  sampleMidi: () => 60,
}))
vi.mock('../audio/sfx', () => ({ sfx: new Proxy({}, { get: () => () => {} }) }))
