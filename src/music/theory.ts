export type Rng = () => number

// Seeded PRNG so generated sessions are reproducible (game-catalog rule 6).
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const pick = <T,>(rng: Rng, xs: readonly T[]): T => xs[Math.floor(rng() * xs.length)]
export const randInt = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1))

/** Semitones above the tonic for major-scale degrees 1..7 */
export const MAJOR = [0, 2, 4, 5, 7, 9, 11]

/** Something to play: notes sounding together for `dur` seconds. Empty notes = rest. */
export type Step = { notes: number[]; dur: number }
