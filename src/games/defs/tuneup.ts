import { pick, randInt, type Inst, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import type { Game, Level } from '../types'

const S = en.games.tuneup
/** detune in cents, choices, instruments */
const LEVELS: { cents: number; ids: string[]; insts: Inst[]; lo?: number; hi?: number }[] = [
  { cents: 50, ids: ['flat', 'sharp'], insts: ['piano'] },
  { cents: 50, ids: ['flat', 'tune', 'sharp'], insts: ['piano'] },
  { cents: 30, ids: ['flat', 'tune', 'sharp'], insts: ['piano', 'flute'] },
  { cents: 20, ids: ['flat', 'tune', 'sharp'], insts: ['violin', 'flute', 'clarinet'] },
  { cents: 12, ids: ['flat', 'tune', 'sharp'], insts: ['violin', 'flute', 'clarinet', 'trumpet', 'cello'] },
  { cents: 20, ids: ['flat', 'tune', 'sharp'], insts: ['cello', 'trombone', 'horn'], lo: 40, hi: 55 },
  { cents: 8, ids: ['flat', 'tune', 'sharp'], insts: ['violin', 'flute', 'clarinet'] },
]
const OFFSET: Record<string, number> = { flat: -1, tune: 0, sharp: 1 }

function level(i: number): Level {
  const { cents, ids, insts, lo = 57, hi = 72 } = LEVELS[i]
  const options = ids.map((id) => ({ id, label: S.names[id], sub: S.subs[id] }))
  const pair = (a: number, id: string, inst: Inst): Step[] => [
    { notes: [a], dur: 0.9, inst }, { notes: [], dur: 0.2 }, { notes: [a + (OFFSET[id] * cents) / 100], dur: 1.1, inst },
  ]
  return {
    title: S.levels[i], skill: S.skills[i], concept: S.concepts[i], options,
    fresh: i === 1 ? ['tune'] : i === 0 ? ids : [],
    demo: (id) => pair(Math.round((lo + hi) / 2), id, insts[0]),
    hint: (id) => S.hints[id],
    generate(rng) {
      const a = randInt(rng, lo, hi)
      const id = pick(rng, ids)
      const inst = pick(rng, insts)
      return { options, answer: id, prompt: pair(a, id, inst), hear: (x) => pair(a, x, inst) }
    },
  }
}

export const tuneup: Game = {
  id: 'tuneup', course: 'pitch', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'mountains', worldName: S.world, arcade: 'blaster', journeyOffset: 2,
  instruments: ['piano', 'flute', 'violin', 'clarinet', 'trumpet', 'cello', 'trombone', 'horn'],
  levels: LEVELS.map((_, i) => level(i)),
}
