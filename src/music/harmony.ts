import type { Step } from './theory'

/** Triads by Roman numeral, as semitones above the key's tonic */
const TRIADS: Record<string, number[]> = {
  I: [0, 4, 7], ii: [2, 5, 9], iii: [4, 7, 11], IV: [5, 9, 12], V: [7, 11, 14], vi: [9, 12, 16], 'vii°': [11, 14, 17],
  i: [0, 3, 7], 'ii°': [2, 5, 8], III: [3, 7, 10], iv: [5, 8, 12], v: [7, 10, 14], VI: [8, 12, 15], VII: [10, 14, 17],
}

/**
 * Voice a chord progression in key `t`: bass plays the root, the upper voices are folded
 * into one octave above the tonic so consecutive chords move smoothly.
 */
export function progression(t: number, numerals: string[], dur = 0.75): Step[] {
  return numerals.map((n, i) => {
    const tones = TRIADS[n]
    const upper = tones.map((x) => t + (x % 12)).sort((a, b) => a - b)
    return { notes: [t - 12 + (tones[0] % 12), ...upper], dur: i === numerals.length - 1 ? dur * 1.7 : dur }
  })
}

export const numerals = (id: string) => id.split(' ')
export const prettyProgression = (id: string) => numerals(id).join(' – ')
