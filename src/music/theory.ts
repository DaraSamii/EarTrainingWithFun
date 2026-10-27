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

export type Inst =
  | 'piano' | 'flute' | 'guitar' | 'trumpet' | 'violin' | 'cello'
  | 'clarinet' | 'saxophone' | 'xylophone' | 'horn' | 'trombone' | 'harp'

/** Unpitched percussion for rhythm games */
export type Perc = 'kick' | 'snare' | 'hat' | 'click' | 'accent'

/**
 * Something to play: notes sounding together for `dur` seconds (fractional MIDI = microtones). Empty notes = rest.
 * `vel` scales loudness (dynamics games), `len` shortens how long notes ring (staccato), `perc` adds drum hits.
 */
export type Step = { notes: number[]; dur: number; inst?: Inst; vel?: number; len?: number; perc?: Perc[] }

export const MINOR = [0, 2, 3, 5, 7, 8, 10]

export const shuffle = <T,>(rng: Rng, xs: readonly T[]): T[] => {
  const a = [...xs]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------- Notation ----------

export const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const
const WHITE = [0, 2, 4, 5, 7, 9, 11]

/** MIDI of a natural note, e.g. natural(2, 4) = E4 = 64 */
export const natural = (letter: number, octave: number) => (octave + 1) * 12 + WHITE[letter]

/** Diatonic position counting letters from C-1 (white keys only); used to place notes on a staff */
export function diatonic(midi: number) {
  const pc = ((midi % 12) + 12) % 12
  const i = WHITE.indexOf(pc)
  return (Math.floor(midi / 12) - 1) * 7 + (i === -1 ? WHITE.indexOf(pc - 1) : i)
}

export const letterOf = (midi: number) => LETTERS[diatonic(midi) % 7]

/** Staff bottom lines: treble E4, bass G2 */
export const CLEF_BOTTOM = { treble: diatonic(64), bass: diatonic(43) }

/** Key signatures, sharps positive and flats negative: [major key name, tonic pitch class] */
export const KEYS: Record<number, [string, number]> = {
  0: ['C', 0], 1: ['G', 7], 2: ['D', 2], 3: ['A', 9], 4: ['E', 4], 5: ['B', 11], 6: ['F♯', 6], 7: ['C♯', 1],
  [-1]: ['F', 5], [-2]: ['B♭', 10], [-3]: ['E♭', 3], [-4]: ['A♭', 8], [-5]: ['D♭', 1], [-6]: ['G♭', 6], [-7]: ['C♭', 11],
}

/** Where the accidentals of a key signature sit on a treble staff (MIDI of the natural line/space) */
export const SIG_SHARPS = [77, 72, 79, 74, 69, 76, 71]
export const SIG_FLATS = [71, 76, 69, 74, 67, 72, 65]

/** MIDI of a natural note from its diatonic position (inverse of `diatonic` for white keys) */
export const fromDiatonic = (d: number) => (Math.floor(d / 7) + 1) * 12 + WHITE[((d % 7) + 7) % 7]
