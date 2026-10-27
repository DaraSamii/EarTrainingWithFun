import { pick, randInt, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import type { Game, Level } from '../types'

const S = en.games.compare
/** semitone difference between the two intervals, and whether "same" is a choice */
const LEVELS = [{ diff: 5, same: false }, { diff: 3, same: false }, { diff: 2, same: true }, { diff: 1, same: true }, { diff: 1, same: true, harmonic: true }]

function level(i: number): Level {
  const { diff, same, harmonic } = LEVELS[i] as { diff: number; same: boolean; harmonic?: boolean }
  const ids = same ? ['first', 'second', 'same'] : ['first', 'second']
  const options = ids.map((id) => ({ id, label: S.names[id] }))
  const pairOf = (root: number, size: number): Step[] => harmonic
    ? [{ notes: [root, root + size], dur: 1.1 }]
    : [{ notes: [root], dur: 0.5 }, { notes: [root + size], dur: 0.8 }]
  const both = (r1: number, a: number, r2: number, b: number): Step[] => [...pairOf(r1, a), { notes: [], dur: 0.6 }, ...pairOf(r2, b)]
  const sizes = (id: string, base: number) => (id === 'first' ? [base + diff, base] : id === 'second' ? [base, base + diff] : [base, base])
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: i === 0 || i === 2 ? ids : [],
    demo: (id) => { const [a, b] = sizes(id, 3); return both(60, a, 62, b) },
    hint: (id) => S.hints[id],
    generate(rng) {
      const id = pick(rng, ids)
      const base = randInt(rng, 2, 7)
      const [a, b] = sizes(id, base)
      const r1 = randInt(rng, 52, 62)
      const r2 = randInt(rng, 52, 62)
      return { options, answer: id, prompt: both(r1, a, r2, b), hear: (x) => { const [c, d] = sizes(x, base); return both(r1, c, r2, d) } }
    },
  }
}

export const compare: Game = {
  id: 'compare', course: 'intervals', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'space', worldName: S.world, arcade: 'blaster', instruments: ['piano'],
  levels: LEVELS.map((_, i) => level(i)),
}
