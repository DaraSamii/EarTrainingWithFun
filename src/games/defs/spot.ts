import { MAJOR, randInt, type Rng, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import type { Game, Level } from '../types'

const S = en.games.spot
/** melody length, size of the change (scale steps; 0 = one chromatic half step) */
const LEVELS = [{ len: 3, step: 4 }, { len: 4, step: 3 }, { len: 4, step: 2 }, { len: 5, step: 1 }, { len: 6, step: 1 }, { len: 6, step: 0 }, { len: 7, step: 1 }, { len: 7, step: 0 }]
const SCALE = Array.from({ length: 22 }, (_, i) => 48 + Math.floor(i / 7) * 12 + MAJOR[i % 7])

function melody(rng: Rng, len: number) {
  let idx = randInt(rng, 9, 12)
  return Array.from({ length: len }, (_, k) => {
    if (k) idx = Math.max(6, Math.min(16, idx + randInt(rng, -2, 2)))
    return idx
  })
}

const tune = (notes: number[]): Step[] => notes.map((n, i) => ({ notes: [n], dur: i === notes.length - 1 ? 0.8 : 0.42 }))

function level(i: number): Level {
  const { len, step } = LEVELS[i]
  const options = Array.from({ length: len }, (_, k) => ({ id: String(k), label: `${S.note} ${k + 1}` }))
  const changed = (rng: Rng, idx: number[], k: number) => {
    const up = rng() < 0.5 ? 1 : -1
    const notes = idx.map((d) => SCALE[d])
    notes[k] = step === 0 ? notes[k] + up : SCALE[idx[k] + up * step]
    return notes
  }
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: i === 0 ? options.map((o) => o.id) : [],
    demo: (id) => {
      const idx = [10, 11, 12, 11, 10, 9, 10].slice(0, len)
      const fixed = (() => 0.9) as Rng
      return [...tune(idx.map((d) => SCALE[d])), { notes: [], dur: 0.6 }, ...tune(changed(fixed, idx, +id))]
    },
    hint: (id) => `${S.hint} ${+id + 1}`,
    generate(rng) {
      const idx = melody(rng, len)
      const k = randInt(rng, 0, len - 1)
      const before = idx.map((d) => SCALE[d])
      const after = changed(rng, idx, k)
      return {
        options, answer: String(k),
        prompt: [...tune(before), { notes: [], dur: 0.7 }, ...tune(after)],
        hear: (x) => [{ notes: [before[+x]], dur: 0.6 }, { notes: [after[+x]], dur: 0.8 }],
      }
    },
  }
}

export const spot: Game = {
  id: 'spot', course: 'melody', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'river', worldName: S.world, arcade: 'river', journeyOffset: 1, instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
