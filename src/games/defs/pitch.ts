import { pick, randInt, type Inst, type Step } from '../../music/theory'
import { en } from '../../i18n/en'
import type { Game, Level } from '../types'

const S = en.games.pitch
/** gap in semitones (0.5 = 50 cents), instruments, register */
const LEVELS: { gap: number; insts: Inst[]; lo: number; hi: number }[] = [
  { gap: 4, insts: ['piano'], lo: 57, hi: 72 },
  { gap: 2, insts: ['piano'], lo: 57, hi: 72 },
  { gap: 1, insts: ['piano'], lo: 57, hi: 72 },
  { gap: 0.5, insts: ['flute', 'violin'], lo: 62, hi: 76 },
  { gap: 1, insts: ['cello', 'trombone'], lo: 40, hi: 55 },
  { gap: 0.25, insts: ['piano', 'flute', 'violin', 'clarinet'], lo: 57, hi: 74 },
  { gap: 1, insts: ['piano', 'flute', 'cello', 'trumpet', 'guitar'], lo: 45, hi: 79 },
  { gap: 0.12, insts: ['flute', 'violin', 'clarinet'], lo: 62, hi: 76 },
]

function level(i: number): Level {
  const { gap, insts, lo, hi } = LEVELS[i]
  const options = [{ id: 'up', label: S.up, sub: '↑' }, { id: 'down', label: S.down, sub: '↓' }]
  const pair = (a: number, id: string, inst: Inst): Step[] => [
    { notes: [a], dur: 0.8, inst }, { notes: [], dur: 0.15 }, { notes: [a + (id === 'up' ? gap : -gap)], dur: 1, inst },
  ]
  return {
    title: S.levels[i],
    skill: S.skills[i],
    concept: S.concepts[i],
    options,
    fresh: [],
    demo: (id) => pair(id === 'up' ? lo + 3 : hi - 3, id, insts[0]),
    hint: (id) => S.hints[id],
    generate(rng) {
      const a = randInt(rng, lo, hi)
      const id = pick(rng, ['up', 'down'])
      const inst = pick(rng, insts)
      return { options, answer: id, prompt: pair(a, id, inst), hear: (x) => pair(a, x, inst) }
    },
  }
}

export const pitch: Game = {
  id: 'pitch', course: 'pitch', title: S.title, blurb: S.blurb, instruction: S.instruction,
  world: 'mountains', worldName: S.world, arcade: 'climber', instruments: ['piano', 'flute', 'violin', 'clarinet', 'cello', 'trombone', 'trumpet', 'guitar'],
  levels: LEVELS.map((_, i) => level(i)),
}
